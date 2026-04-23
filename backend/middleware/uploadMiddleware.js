import multer from 'multer';
import { storage as cloudinaryStorage } from '../config/cloudinary.js';

const fileFilter = (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const mime = allowed.test(file.mimetype);
    if (mime) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
    }
};

const upload = multer({
    storage: cloudinaryStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

export default upload;
