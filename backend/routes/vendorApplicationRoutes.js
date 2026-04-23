import express from 'express';
import {
    submitApplication,
    getApplications,
    getMyApplication,
    updateApplicationStatus
} from '../controllers/vendorApplicationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitApplication);
router.get('/my', protect, getMyApplication);
router.get('/', protect, admin, getApplications);
router.put('/:id', protect, admin, updateApplicationStatus);

export default router;
