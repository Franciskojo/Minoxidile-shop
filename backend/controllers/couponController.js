import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';

// @desc    Apply coupon
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = asyncHandler(async (req, res) => {
    const { code, orderAmount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found');
    }

    // Validity checks
    if (!coupon.isActive) {
        res.status(400);
        throw new Error('This coupon is no longer active');
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        res.status(400);
        throw new Error('This coupon has expired');
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        res.status(400);
        throw new Error('This coupon has reached its usage limit');
    }

    if (coupon.usedBy.some((id) => id.toString() === req.user._id.toString())) {
        res.status(400);
        throw new Error('You have already used this coupon');
    }

    if (orderAmount < coupon.minOrderAmount) {
        res.status(400);
        throw new Error(`Minimum order amount for this coupon is $${coupon.minOrderAmount}`);
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
        discount = (orderAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount) {
            discount = Math.min(discount, coupon.maxDiscountAmount);
        }
    } else {
        discount = Math.min(coupon.discountValue, orderAmount);
    }

    discount = Math.round(discount * 100) / 100;

    res.json({
        success: true,
        message: 'Coupon applied successfully!',
        coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
        discount,
    });
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Admin
export const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
});

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Admin
export const createCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created', coupon });
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Admin
export const updateCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found');
    }
    res.json({ success: true, message: 'Coupon updated', coupon });
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found');
    }
    res.json({ success: true, message: 'Coupon deleted' });
});
