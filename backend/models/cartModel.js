import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    qty: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1,
    },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
        coupon: {
            code: { type: String, default: null },
            discount: { type: Number, default: 0 },
        },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cartSchema.virtual('subTotal').get(function () {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
});

cartSchema.virtual('totalItems').get(function () {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
