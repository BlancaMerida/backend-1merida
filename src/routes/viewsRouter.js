// src/routes/viewsRouter.js
import { Router } from 'express';
import { passportCall } from '../utils.js';
import { auth } from '../middleware/auth.js';
import ViewsController from '../controllers/ViewsController.js';

const router = Router();

router.get('/', ViewsController.renderHome);
router.get('/registro', ViewsController.renderRegistro);
router.get('/login', ViewsController.renderLogin);
router.get('/current', passportCall('current'), auth(), ViewsController.renderCurrent);
router.get('/cart/:cid', ViewsController.renderCart);
router.get('/products', ViewsController.renderProducts);
router.get('/products/:pid', ViewsController.renderProductDetails);

export default router;