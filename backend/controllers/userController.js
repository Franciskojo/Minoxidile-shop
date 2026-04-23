import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist', 'name slug images price salePrice rating');
    res.json({ success: true, user });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (email && email !== user.email) {
        const exists = await User.findOne({ email });
        if (exists) {
            res.status(400);
            throw new Error('Email already in use');
        }
        user.email = email;
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
        success: true,
        message: 'Profile updated successfully',
        user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role },
    });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
        res.status(400);
        throw new Error('Current password is incorrect');
    }

    if (newPassword.length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters');
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
});

// @desc    Add shipping address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { isDefault, ...addressData } = req.body;

    if (isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({ ...addressData, isDefault: isDefault || user.addresses.length === 0 });
    await user.save();

    res.status(201).json({ success: true, message: 'Address added', addresses: user.addresses });
});

// @desc    Delete shipping address
// @route   DELETE /api/users/addresses/:id
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, message: 'Address removed', addresses: user.addresses });
});

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/:productId
// @access  Private
export const toggleWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const idx = user.wishlist.findIndex((id) => id.toString() === productId);
    let action;
    if (idx > -1) {
        user.wishlist.splice(idx, 1);
        action = 'removed';
    } else {
        user.wishlist.push(productId);
        action = 'added';
    }

    await user.save();
    res.json({ success: true, message: `Item ${action} to wishlist`, wishlist: user.wishlist });
});

// === ADMIN ===

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search
        ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
        : {};

    const [users, total] = await Promise.all([
        User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(query),
    ]);

    res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json({ success: true, user });
});

// @desc    Update user role / status
// @route   PUT /api/users/:id
// @access  Admin
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (req.body.role) user.role = req.body.role;
    if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;
    if (req.body.name) user.name = req.body.name;

    await user.save();
    res.json({ success: true, message: 'User updated', user });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
});
