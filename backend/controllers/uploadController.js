import asyncHandler from 'express-async-handler';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Vendor/Admin
export const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    res.json({
        success: true,
        message: 'Image uploaded successfully',
        url: req.file.path, // Cloudinary URL
        public_id: req.file.filename,
        mimetype: req.file.mimetype,
    });
});

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/upload/multiple
// @access  Vendor/Admin
export const uploadMultipleImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('No files uploaded');
    }

    const images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
    }));

    res.json({
        success: true,
        message: 'Images uploaded successfully',
        images,
    });
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:public_id
// @access  Vendor/Admin
export const deleteImage = asyncHandler(async (req, res) => {
    const { public_id } = req.params;
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
        res.json({ success: true, message: 'Image deleted successfully' });
    } else {
        res.status(400);
        throw new Error('Delete failed from Cloudinary');
    }
});
