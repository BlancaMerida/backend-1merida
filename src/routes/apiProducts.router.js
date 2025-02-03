// src/routes/apiProducts.router.js
import { Router } from 'express';
import ProductsController from '../controllers/ProductsController.js';
import { auth } from '../middleware/auth.js';
import { passportCall } from '../utils.js';

export const router = Router();

router.use(passportCall('current'));

router.get('/', ProductsController.getProducts);
router.get('/:id', ProductsController.getProductById);
router.post('/', auth('admin'), ProductsController.createProduct);
router.put('/:id', auth('admin'), ProductsController.updateProduct);
router.delete('/:id', auth('admin'), ProductsController.deleteProduct);