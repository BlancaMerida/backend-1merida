import { CartManager } from '../dao/cartManager.js';
import ProductManager from '../dao/productManager.js';

class CartService {
    async getCartById(cartId) {
        return await CartManager.getCart(cartId);
    }

    async addProductToCart(cart, product, quantity) {
        const existingProduct = cart.products.find(item => item.product.toString() === product._id.toString());
    
        const totalQuantity = existingProduct ? existingProduct.quantity + quantity : quantity;
        if (product.stock < totalQuantity) {
            throw new Error('La cantidad total en el carrito excede el stock disponible.');
        }
    
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: product._id, quantity });
        }
    
        product.stock -= quantity;
        await ProductManager.update(product._id, { stock: product.stock });
    
        await cart.save(); 
        return cart;
    }

    async deleteProductFromCart(cartId, productId) {
        return await CartManager.deleteProductFromCart(cartId, productId);
    }

    async getAllCarts() {
        return await CartManager.getAllCarts();
    }

    async clearCart(cartId) {
        return await CartManager.clearCart(cartId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartManager.getCart(cartId);
        const productInCart = cart.products.find(p => p.product.equals(mongoose.Types.ObjectId(productId)));

        if (!productInCart) {
            throw new Error('Producto no encontrado en el carrito.');
        }

        productInCart.quantity = quantity;
        await cart.save();

        return cart;
    }

    async updateCart(filtro={}, cartData) {
        return await CartManager.update(filtro, cartData);
    }

    async createCart() {
        return await CartManager.create();
    }
}

export const cartService = new CartService();