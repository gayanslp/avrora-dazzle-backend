import express from 'express';
import { 
    addToCart, 
    getCart, 
    updateCartItemQty, 
    removeFromCart, 
    clearCart, 
    getWishlist, 
    toggleWishlist 
} from "../controllers/cartcontroller.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addToCart);
router.put('/:itemId', authMiddleware, updateCartItemQty);
router.delete('/clear', authMiddleware, clearCart);
router.delete('/:itemId', authMiddleware, removeFromCart);
router.get('/wishlist', authMiddleware, getWishlist);
router.post('/wishlist/:productId', authMiddleware, toggleWishlist);

export default router;