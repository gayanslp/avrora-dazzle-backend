import express from 'express';
import { createCoupon, getAllCoupons, getCouponById, updateCoupon, deleteCoupon } from '../controllers/coupenController.js';
import authMiddleware from '../middleware/authMiddleware.js';  

const coupenRouter = express.Router();

coupenRouter.post('/', authMiddleware, createCoupon);
coupenRouter.get('/', authMiddleware, getAllCoupons);
coupenRouter.get('/:code', authMiddleware, getCouponById);
coupenRouter.put('/:code', authMiddleware, updateCoupon);
coupenRouter.delete('/:code', authMiddleware, deleteCoupon);

export default coupenRouter;