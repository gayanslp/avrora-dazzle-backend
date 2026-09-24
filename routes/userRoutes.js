import express from 'express';
import { getProfile } from '../controllers/uerController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getProfile);


export default userRouter;