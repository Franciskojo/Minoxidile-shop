import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/contactMessageModel.js';
import { sendContactEmail } from '../utils/emailService.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    // 1. Save to database
    const inquiry = await ContactMessage.create({
        name,
        email,
        subject,
        message,
    });

    // 2. Send email notification to admin
    try {
        await sendContactEmail({ name, email, subject, message });
    } catch (err) {
        console.error('Email notification failed:', err);
        // We still return success since it's saved to DB
    }

    res.status(201).json({
        success: true,
        message: 'Your inquiry has been submitted successfully!',
        data: inquiry,
    });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin
export const getMessages = asyncHandler(async (req, res) => {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });

    res.json({
        success: true,
        count: messages.length,
        data: messages,
    });
});

// @desc    Mark message as read
// @route   PUT /api/contact/:id
// @access  Admin
export const markAsRead = asyncHandler(async (req, res) => {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    message.isRead = true;
    await message.save();

    res.json({
        success: true,
        data: message,
    });
});
