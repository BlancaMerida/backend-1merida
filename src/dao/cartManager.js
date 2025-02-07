import mongoose from 'mongoose';
import Cart from './models/cart.model.js';

export class CartManager {
    static async create() {
        return await Cart.create({ products: [] });
    }


    static async getCart(cartId) {
        const cart = await Cart.findById(cartId).populate('products.product');
        return cart;
    }

    static async getAllCarts() {
        return await Cart.find().populate('products.product');
    }

    static async update(filtro={}, cartData) {
        return await Cart.updateOne(filtro, cartData);
    }

    static async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            console.log("Carrito no encontrado en la base de datos."); 
            return null;
        }
        cart.products = [];
        await cart.save();
        return cart;
    }


    static async deleteProductFromCart(cartId, productId) {
        const cart = await this.getCart(cartId);
        cart.products = cart.products.filter(p => !p.product.equals(productId));
        await cart.save();
        return cart;
    }
}