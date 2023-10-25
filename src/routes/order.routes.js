import { Router } from 'express';
import { createOrder, deleteOrderById, getOrderById, getOrders, updateOrderById } from '../controllers/order.controller.js';
import { validateSchema } from '../middlewares/validator.middlware.js';
import { orderSchema } from '../schemas/order.js';
import { authRequired} from '../middlewares/validateToken.js';

const router = Router();



router.post('/order', authRequired, validateSchema(orderSchema), createOrder);

router.get('/orders', authRequired, getOrders);
router.get('/order/:id', authRequired, getOrderById);
router.put('/order/:id', authRequired, updateOrderById);
router.delete('/order/:id', authRequired, deleteOrderById);
export default router;

