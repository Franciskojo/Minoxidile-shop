import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Coupon code is required'],
            unique: true,
            uppercase: true,
            trim: true,
            maxlength: 20,
        },
        description: { type: String, default: '' },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
        },
        discountValue: {
            type: Number,
            required: [true, 'Discount value is required'],
            min: [0, 'Discount value must be positive'],
        },
        minOrderAmount: { type: Number, default: 0 },
        maxDiscountAmount: { type: Number, default: null }, // for percentage coupons
        maxUses: { type: Number, default: null }, // null = unlimited
        usedCount: { type: Number, default: 0 },
        usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        expiresAt: { type: Date, default: null },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Virtual: is coupon valid
couponSchema.virtual('isValid').get(function () {
    const now = new Date();
    const notExpired = !this.expiresAt || this.expiresAt > now;
    const hasUses = this.maxUses === null || this.usedCount < this.maxUses;
    return this.isActive && notExpired && hasUses;
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
