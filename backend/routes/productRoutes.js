import express from 'express';
import {
    getProducts, getFeaturedProducts, getTopRated, getProductBySlug,
    createProduct, updateProduct, deleteProduct, getRelatedProducts,
} from '../controllers/productController.js';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/top-rated', getTopRated);
router.post('/', protect, vendor, createProduct);

router.get('/:slug', getProductBySlug);
router.put('/:id', protect, vendor, updateProduct);
router.delete('/:id', protect, vendor, deleteProduct);
router.get('/:id/related', getRelatedProducts);

export default router;
