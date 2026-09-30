import express from 'express';

import { applyCoupon, createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } from "../controllers/ordercontroller.js";
import authMiddleware from '../middleware/authMiddleware.js';
 

const router = express.Router();

router.post('/',authMiddleware, createOrder);
router.get('/myorders', authMiddleware, getMyOrders);
router.get('/all', authMiddleware, getAllOrders);
router.get('/:orderId', authMiddleware, getOrderById);
router.put('/:orderId/status', authMiddleware, updateOrderStatus);
router.post('/apply-coupon', authMiddleware, applyCoupon);

export default router;