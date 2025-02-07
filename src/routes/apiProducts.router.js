import { Router } from 'express';
import ProductsController from '../controllers/ProductsController.js';
import { auth } from '../middleware/auth.js';
import { passportCall } from '../utils/utils.js';

export const router = Router();

router.get('/mocks', ProductsController.createMockProduct);
router.get('/mocks/:quantity', ProductsController.createMockProducts);

router.use(passportCall('current'));

router.get('/', ProductsController.getProducts);
router.get('/:id', ProductsController.getProductById);
router.post('/', auth('admin'), ProductsController.createProduct);
router.put('/:id', auth('admin'), ProductsController.updateProduct);
router.delete('/:id', auth('admin'), ProductsController.deleteProduct);