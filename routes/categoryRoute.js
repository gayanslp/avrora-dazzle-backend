import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 

const categoryRouter = express.Router();

categoryRouter.get('/', getCategories);
categoryRouter.get('/:_id', getCategoryById);
categoryRouter.post('/', authMiddleware, createCategory);
categoryRouter.put('/:_id', authMiddleware, updateCategory);
categoryRouter.delete('/:_id', authMiddleware, deleteCategory);

export default categoryRouter;
