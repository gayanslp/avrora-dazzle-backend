import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import  authMiddleware  from '../middleware/AuthMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Only admins should upload images, but authMiddleware covers the basic check,
// we can add admin check here too or inside the controller. 
// Assuming authMiddleware checks for user token.
router.post('/', authMiddleware, upload.single('image'), uploadImage);

export default router;
