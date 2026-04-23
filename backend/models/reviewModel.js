import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            required: [true, 'Review title is required'],
            maxlength: 100,
        },
        comment: {
            type: String,
            required: [true, 'Review comment is required'],
            maxlength: 1000,
        },
        isVerifiedPurchase: { type: Boolean, default: false },
        helpfulVotes: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product rating stats after save
reviewSchema.post('save', async function () {
    const Product = mongoose.model('Product');
    const stats = await mongoose.model('Review').aggregate([
        { $match: { product: this.product } },
        { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(this.product, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            numReviews: stats[0].count,
        });
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
