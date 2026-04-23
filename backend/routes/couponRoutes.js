import express from 'express';
import { applyCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyCoupon);
router.get('/', protect, admin, getAllCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;
