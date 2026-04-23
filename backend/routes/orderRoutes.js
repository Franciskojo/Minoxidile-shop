import express from 'express';
import {
    placeOrder, getMyOrders, getOrderById, updateOrderToPaid,
    cancelOrder, getAllOrders, updateOrderStatus, createStripeSession
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);

// Admin
router.get('/', protect, admin, getAllOrders);

router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.post('/:id/stripe-session', protect, createStripeSession);

export default router;
