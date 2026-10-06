import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import  authMiddleware  from '../middleware/AuthMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

router.post('/', authMiddleware, upload.any(), uploadImage);

export default router;
