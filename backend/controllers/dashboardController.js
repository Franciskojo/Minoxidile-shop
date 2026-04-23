import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard
// @access  Admin
export const getStats = asyncHandler(async (req, res) => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
        totalUsers,
        totalProducts,
        totalOrders,
        revenueData,
        newUsersThisMonth,
        pendingOrders,
        recentOrders,
        salesChart,
        topProducts,
        ordersByStatus,
    ] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
        ]),
        User.countDocuments({ createdAt: { $gte: thisMonthStart } }),
        Order.countDocuments({ status: 'pending' }),
        Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5),
        // Last 7 days sales chart
        Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$totalPrice' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]),
        // Top selling products (by order count)
        Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    name: { $first: '$items.name' },
                    totalSold: { $sum: '$items.qty' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
        ]),
        Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;
    const totalPaidOrders = revenueData[0]?.count || 0;

    res.json({
        success: true,
        stats: {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            totalPaidOrders,
            newUsersThisMonth,
            pendingOrders,
        },
        recentOrders,
        salesChart,
        topProducts,
        ordersByStatus,
    });
});
