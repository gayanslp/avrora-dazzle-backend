import express from 'express';
import { getProfile, updateProfile } from '../controllers/uerController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getProfile);
userRouter.put('/profile', authMiddleware, updateProfile);


export default userRouter;