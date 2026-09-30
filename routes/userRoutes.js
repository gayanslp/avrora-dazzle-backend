import express from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/uerController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getProfile);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.get('/', authMiddleware, getAllUsers);

export default userRouter;