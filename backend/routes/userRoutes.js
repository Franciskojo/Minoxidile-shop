import express from 'express';
import {
    getProfile, updateProfile, changePassword, addAddress, deleteAddress,
    toggleWishlist, getAllUsers, getUserById, updateUser, deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);

// Admin routes
router.get('/', protect, admin, getAllUsers);
router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;
