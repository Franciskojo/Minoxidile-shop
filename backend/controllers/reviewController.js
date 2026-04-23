import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';
import Order from '../models/orderModel.js';

// @desc    Create review
// @route   POST /api/reviews/:productId
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
    const { rating, title, comment } = req.body;
    const productId = req.params.productId;

    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
        res.status(400);
        throw new Error('You have already reviewed this product');
    }

    // Check verified purchase
    const order = await Order.findOne({
        user: req.user._id,
        'items.product': productId,
        status: 'delivered',
    });

    const review = await Review.create({
        user: req.user._id,
        product: productId,
        rating,
        title,
        comment,
        isVerifiedPurchase: !!order,
    });

    const populated = await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, message: 'Review added', review: populated });
});

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        Review.find({ product: req.params.productId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Review.countDocuments({ product: req.params.productId }),
    ]);

    res.json({ success: true, reviews, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (own) or Admin
export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized');
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate product rating
    const Product = (await import('../models/productModel.js')).default;
    const stats = await Review.aggregate([
        { $match: { product: productId } },
        { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            numReviews: stats[0].count,
        });
    } else {
        await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
    }

    res.json({ success: true, message: 'Review deleted' });
});
