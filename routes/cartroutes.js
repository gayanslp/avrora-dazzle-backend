import express from 'express';


import { addToCart, getCart, getWishlist, removeFromCart, toggleWishlist } from "../controllers/cartcontroller.js";
import authMiddleware from '../middleware/authMiddleware.js';



const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/',authMiddleware, addToCart);
router.delete('/:itemId', authMiddleware, removeFromCart);  
router.get('/wishlist', authMiddleware, getWishlist);
router.post('/wishlist/:productId', authMiddleware, toggleWishlist);


export default router;