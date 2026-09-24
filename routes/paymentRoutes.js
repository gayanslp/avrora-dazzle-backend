import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { generatePaymentHash, handlePayHereNotification } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.post("/payhere-hash",authMiddleware,generatePaymentHash);

paymentRouter.post("/payhere-notify",  handlePayHereNotification);


export default paymentRouter;
