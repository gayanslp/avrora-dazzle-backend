import express from 'express';
import {
    getSettings,
    updateSettings,
    getHeroSlides,
    addHeroSlide,
    updateHeroSlides,
    deleteHeroSlide,
} from '../controllers/settingController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Public endpoints
router.get('/', getSettings);
router.get('/hero-slides', getHeroSlides);

// Admin-only endpoints
router.put('/', authMiddleware, updateSettings);
router.post('/hero-slides', authMiddleware, addHeroSlide);
router.put('/hero-slides', authMiddleware, updateHeroSlides);
router.delete('/hero-slides/:slideId', authMiddleware, deleteHeroSlide);

export default router;
