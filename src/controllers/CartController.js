// src/controllers/CartController.js
import { productService } from '../repository/Product.service.js';
import { cartService } from '../repository/Cart.service.js';
import { isValidObjectId } from 'mongoose';
import { procesaErrores } from '../utils.js';
import { v4 as uuidv4 } from 'uuid';
import { ticketModel } from '../dao/models/ticketModel.js';

export class CartController {
    static async createEmptyCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).json({ message: 'Carrito creado', cart: newCart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async addProductToExistingCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'El ID del carrito o del producto no es válido.' });
        }

        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número mayor que cero.' });
        }

        try {
            const cart = await cartService.getCartById(cid)
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado.' });
            }

            const product = await productService.getProductBy({ _id: pid });
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado.' });
            }

            const existingProduct = cart.products.find(item => item.product._id.toString() === pid);

            const totalQuantity = existingProduct ? existingProduct.quantity + parsedQuantity : parsedQuantity;

            if (totalQuantity > product.stock) {
                return res.status(400).json({
                    error: `No hay suficiente stock disponible. Stock actual: ${product.stock}`,
                });
            }

            if (existingProduct) {
                existingProduct.quantity += parsedQuantity;
            } else {
                cart.products.push({ product: product._id.toString(), quantity: parsedQuantity });
            }

            await cart.save();

            res.status(200).json({ message: 'Producto agregado al carrito', cart });
        } catch (error) {
            console.error("Error en addProductToExistingCart:", error);
            res.status(500).json({ error: 'Ocurrió un error al agregar el producto al carrito.', details: error.message });
        }
    }


    static async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;

            if (!isValidObjectId(cid)) {
                return res.status(400).json({ error: 'El ID del carrito no es válido' });
            }

            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ error: 'El cuerpo de la solicitud debe incluir un array de productos' });
            }

            const validProducts = await Promise.all(
                products.map(async (product) => {
                    if (!isValidObjectId(product.productId) || typeof product.quantity !== 'number' || product.quantity <= 0) {
                        return null;
                    }

                    const existingProduct = await productService.getProductById(product.productId);
                    if (!existingProduct) {
                        return null;
                    }

                    return product;
                })
            );
            const filteredProducts = validProducts.filter(product => product !== null);

            if (filteredProducts.length === 0) {
                return res.status(400).json({ error: 'Todos los productos son inválidos o no existen' });
            }

            const updatedCart = await cartService.updateCart(cid, { products: filteredProducts });
            res.status(200).json({ message: 'Carrito actualizado', cart: updatedCart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
                return res.status(400).json({ error: 'El ID del carrito o producto no es válido' });
            }

            const parsedQuantity = parseInt(quantity);
            if (parsedQuantity <= 0) {
                return res.status(400).json({ error: 'La cantidad debe ser mayor que cero.' });
            }

            const cart = await cartService.getCartById(cid)
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            const product = await productService.getProductBy({ pid });
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const updatedCart = await cartService.updateProductQuantity(cid, pid, parsedQuantity);
            res.status(200).json({ message: 'Cantidad actualizada', cart: updatedCart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async deleteProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;

            if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
                return res.status(400).json({ error: 'El ID del carrito o producto no es válido' });
            }
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            const productIndex = cart.products.findIndex(item => item.product._id.toString() === pid.toString());
            if (productIndex === -1) {
                return res.status(404).json({ error: 'El producto no se encuentra en el carrito' });
            }

            const updatedCart = await cartService.deleteProductFromCart(cid, pid);
            res.status(200).json({ message: 'Producto eliminado del carrito', cart: updatedCart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async clearCart(req, res) {
        try {
            if (!req.user || !req.user.cart || !isValidObjectId(req.user.cart)) {
                return res.status(400).json({ error: 'No se encontró un carrito asociado al usuario.' });
            }

            const cartId = req.user.cart;

            const clearedCart = await cartService.clearCart(cartId);

            if (!clearedCart) {
                return res.status(404).json({ error: 'Carrito no encontrado.' });
            }

            res.status(200).json({ message: 'Carrito vaciado correctamente', cart: clearedCart });
        } catch (error) {
            res.status(500).json({ error: 'No se pudo vaciar el carrito', message: error.message });
        }
    }

    static async getAllCarts(req, res) {
        try {
            const carts = await cartService.getAllCarts();
            res.status(200).json(carts);
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async getCartById(req, res) {
        try {
            const { cid } = req.params;

            if (!isValidObjectId(cid)) {
                return res.status(400).json({ error: 'El ID del carrito no es válido' });
            }

            const cart = await cartService.getCartById(cid);
            res.status(200).json({ cart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async purchaseCart(req, res) {
        const { cid } = req.params
        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe carrito con id ${cid}` })
        }
        if (req.user.cart != cid) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El cart que quiere comprar no pertenece al usuario autenticado` })
        }
        try {
            const carrito = await cartService.getCartById({ _id: cid })
            if (!carrito) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `No existe carrito` })
            }

            const conStock = []
            const sinStock = []
            let error = false

            if (!carrito.products || carrito.products.length === 0) {
                return res.status(400).json({ error: "El carrito está vacío." });
            }

            for (let i = 0; i < carrito.products.length; i++) {
                const codigo = carrito.products[i].product._id || carrito.products[i].product;
                const producto = await productService.getProductBy({ _id: codigo });
                const cantidad = carrito.products[i].quantity
                if (!producto) {
                    error = true
                    sinStock.push({
                        product: codigo,
                        quantity: cantidad
                    })
                } else {
                    if (producto.stock >= cantidad) {
                        conStock.push({
                            codigo,
                            cantidad,
                            precio: producto.price,
                            descrip: producto.description,
                            subtotal: producto.price * cantidad
                        })
                        producto.stock -= cantidad
                        await productService.updateProduct(codigo, producto) //desactivar para testear
                    } else {
                        error = true
                        sinStock.push({
                            product: codigo,
                            quantity: cantidad
                        })
                    }
                }
            } //fin for

            if (conStock.length == 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `No existen items en condiciones de ser facturados` })
            }

            let code = uuidv4();
            let purchase_datetime = new Date();
            const amount = conStock.reduce((acum, item) => acum + item.subtotal, 0);
            let purchaser = req.user.email;

            let ticket = await ticketModel.create({
                code,
                purchase_datetime,
                amount,
                purchaser,
                detalle: conStock
            })
            carrito.products = sinStock
            await cartService.updateCart({ _id: cid }, carrito)

            if (error) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ ticket, alerta: 'Atención: algún item no pudo ser procesado por falta de inventario, consulte al administrador' })
            } else {

            }

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ ticket });
        } catch (error) {
            procesaErrores(res, error)
        }
    }
}