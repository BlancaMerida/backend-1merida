import ProductManager from "../dao/productManager.js";
import { createMockProduct } from '../utils/mocks.utils.js';


export class ProductService {
    constructor(DAO) {
        this.ProductManager = DAO;
    }

    async getProducts(filter = {}, options = {}) {
        try {
            return await this.ProductManager.get(filter, options);
        } catch (error) {
            throw new Error('Error obteniendo productos: ' + error.message);
        }
    }

    async getProductBy(filter = {}) {
        try {
            const product = await this.ProductManager.getBy(filter);

            if (product) {
                return product;
            }
            return null;
        } catch (error) {
            throw new Error('Error obteniendo producto: ' + error.message);
        }
    }

    async createProduct(productData) {
        try {
            return await this.ProductManager.create(productData);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.code) {
                return { error: true, message: 'El código del producto ya existe, elija uno único.' };
            }
            throw new Error('Error creando producto: ' + error.message);
        }
    }

    async createMockProduct() {
        try {
            const productData = createMockProduct();
            const one = await this.ProductManager.create(productData);
            return one;
        } catch (error) {
            throw new Error('Error creando Mock Product: ' + error.message)
        }
    }

    async createMockProducts(quantity) {
        try {
            const products = [];
            for (let index = 0; index < quantity; index++) {
                const one = createMockProduct()
                products.push(one);
            }
            return products;
        } catch (error) {
            throw new Error('Error creando Mock Products: ' + error.message)
        }
    }


    async updateProduct(id, productData) {
        try {
            const updatedProduct = await this.ProductManager.update(id, productData);
            if (!updatedProduct) {
                throw new Error('Producto no encontrado.');
            }
            if (updatedProduct.stock < 0) {
                throw new Error('El stock del producto no puede ser negativo.');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error('Error actualizando producto: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await this.ProductManager.delete(id);
            if (!deletedProduct) {
                throw new Error('Producto no encontrado.');
            }
            return true;
        } catch (error) {
            throw new Error('Error eliminando producto: ' + error.message);
        }
    }
}

export const productService = new ProductService(ProductManager);