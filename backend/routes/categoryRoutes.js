import express from 'express';
import {
    getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, admin, createCategory);
router.get('/:slug', getCategoryBySlug);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
