import express from 'express';
import { submitContactForm, getMessages, markAsRead } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(submitContactForm)
    .get(protect, admin, getMessages);

router.route('/:id').put(protect, admin, markAsRead);

export default router;
