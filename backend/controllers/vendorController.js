import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

// @desc    Get vendor dashboard stats
// @route   GET /api/vendor/stats
// @access  Vendor
export const getVendorStats = asyncHandler(async (req, res) => {
    const vendorId = req.user._id;

    // 1. Total revenue for this vendor's products
    const revenueData = await Order.aggregate([
        { $unwind: '$items' },
        { $match: { 'items.vendor': new mongoose.Types.ObjectId(vendorId), isPaid: true } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } }
    ]);

    // 2. Total orders containing this vendor's products
    const totalOrders = await Order.countDocuments({
        'items.vendor': vendorId
    });

    // 3. Total products owned by vendor
    const totalProducts = await Product.countDocuments({ vendor: vendorId });

    // 4. Monthly Sales (Last 6 months)
    const monthlySales = await Order.aggregate([
        { $unwind: '$items' },
        {
            $match: {
                'items.vendor': new mongoose.Types.ObjectId(vendorId),
                isPaid: true,
                createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
            }
        },
        {
            $group: {
                _id: { $month: '$createdAt' },
                revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } }
            }
        },
        { $sort: { '_id': 1 } }
    ]);

    res.json({
        success: true,
        stats: {
            totalRevenue: revenueData[0]?.total || 0,
            totalOrders,
            totalProducts,
            monthlySales
        }
    });
});

// @desc    Get vendor products
// @route   GET /api/vendor/products
// @access  Vendor
export const getVendorProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Product.find({ vendor: req.user._id })
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Product.countDocuments({ vendor: req.user._id })
    ]);

    res.json({ success: true, products, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Get vendor orders
// @route   GET /api/vendor/orders
// @access  Vendor
export const getVendorOrders = asyncHandler(async (req, res) => {
    // Find orders that contain at least one item from this vendor
    const orders = await Order.find({ 'items.vendor': req.user._id })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    // Filter items in each order to only show vendor's own items for their view
    const filteredOrders = orders.map(order => {
        const orderObj = order.toObject();
        orderObj.items = orderObj.items.filter(item => item.vendor.toString() === req.user._id.toString());

        // Calculate vendor-specific subtotal for this order
        orderObj.vendorSubtotal = orderObj.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

        return orderObj;
    });

    res.json({ success: true, orders: filteredOrders });
});

// @desc    Update vendor settings
// @route   PUT /api/vendor/settings
// @access  Vendor
export const updateVendorSettings = asyncHandler(async (req, res) => {
    const { storeName, storeDescription, businessEmail, businessPhone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.storeName = storeName || user.storeName;
    user.storeDescription = storeDescription || user.storeDescription;
    user.businessEmail = businessEmail || user.businessEmail;
    user.businessPhone = businessPhone || user.businessPhone;

    const updatedUser = await user.save();

    res.json({
        success: true,
        message: 'Vendor settings updated successfully',
        user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            storeName: updatedUser.storeName,
            storeDescription: updatedUser.storeDescription,
            businessEmail: updatedUser.businessEmail,
            businessPhone: updatedUser.businessPhone
        }
    });
});
