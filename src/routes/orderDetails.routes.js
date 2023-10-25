import { Router } from 'express';
import { createDetallePedido, getOrderDeatilsForId, getOrdersDeatils, updateOrderDeatilsForId } from '../controllers/orderDetails.controller.js';


const router = Router();

router.post('/orderDetails', createDetallePedido);
router.get('/ordersDetails', getOrdersDeatils);
router.get('/orderDetails/:id', getOrderDeatilsForId);
router.put('/orderDetails/:id', updateOrderDeatilsForId);
export default router;