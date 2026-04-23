import express from 'express';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController.js';
import { protect, vendor } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, vendor, upload.single('image'), uploadImage);
router.post('/multiple', protect, vendor, upload.array('images', 5), uploadMultipleImages);
router.delete('/:public_id', protect, vendor, deleteImage);

export default router;
