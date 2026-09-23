import express from 'express';


import { getCart } from "../controllers/cartcontroller.js";
import authMiddleware from '../middleware/authMiddleware.js';



const router = express.Router();

router.get('/', authMiddleware, getCart);

export default router;