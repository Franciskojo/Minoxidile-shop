import asyncHandler from 'express-async-handler';
import VendorApplication from '../models/vendorApplicationModel.js';
import User from '../models/userModel.js';

// @desc    Submit vendor application
// @route   POST /api/vendor-applications
// @access  Private
export const submitApplication = asyncHandler(async (req, res) => {
    const { storeName, storeDescription, businessEmail, businessPhone } = req.body;

    const existingApp = await VendorApplication.findOne({ user: req.user._id, status: 'pending' });
    if (existingApp) {
        res.status(400);
        throw new Error('You already have a pending application');
    }

    const application = await VendorApplication.create({
        user: req.user._id,
        storeName,
        storeDescription,
        businessEmail,
        businessPhone,
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully', application });
});

// @desc    Get all applications (Admin)
// @route   GET /api/vendor-applications
// @access  Admin
export const getApplications = asyncHandler(async (req, res) => {
    const applications = await VendorApplication.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, applications });
});

// @desc    Get my application status
// @route   GET /api/vendor-applications/my
// @access  Private
export const getMyApplication = asyncHandler(async (req, res) => {
    const application = await VendorApplication.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, application });
});

// @desc    Update application status (Admin)
// @route   PUT /api/vendor-applications/:id
// @access  Admin
export const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status, adminComment } = req.body;
    const application = await VendorApplication.findById(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    application.status = status;
    application.adminComment = adminComment || application.adminComment;
    await application.save();

    // If approved, update user role to vendor and copy store info
    if (status === 'approved') {
        await User.findByIdAndUpdate(application.user, {
            role: 'vendor',
            storeName: application.storeName,
            storeDescription: application.storeDescription,
            businessEmail: application.businessEmail,
            businessPhone: application.businessPhone
        });
    }

    res.json({ success: true, message: `Application ${status}`, application });
});
