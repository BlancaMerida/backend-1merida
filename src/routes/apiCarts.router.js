// src/routes/apiCarts.router.js
import { Router } from 'express';
import { CartController } from '../controllers/CartController.js';
import { auth } from '../middleware/auth.js';
import { passportCall } from '../utils.js';

export const router = Router();

router.post('/', CartController.createEmptyCart); 

router.get('/:cid',passportCall('current'), CartController.getCartById);

router.post('/:cid/product/:pid', passportCall('current'), CartController.addProductToExistingCart);

router.post('/:cid/purchase', passportCall('current'), CartController.purchaseCart)

router.delete('/:cid/product/:pid',passportCall('current'), CartController.deleteProductFromCart);

router.delete('/',passportCall('current'), CartController.clearCart);

router.get('/', passportCall('current'), auth('admin'), CartController.getAllCarts);

router.put('/:cid',passportCall('current'), CartController.updateCart);

router.put('/:cid/product/:pid',passportCall('current'), CartController.updateProductQuantity);