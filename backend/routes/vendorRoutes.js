import express from 'express';
import {
    getVendorStats,
    getVendorProducts,
    getVendorOrders,
    updateVendorSettings
} from '../controllers/vendorController.js';
import { protect, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(vendor);

router.get('/stats', getVendorStats);
router.get('/products', getVendorProducts);
router.get('/orders', getVendorOrders);
router.put('/settings', updateVendorSettings);

export default router;
