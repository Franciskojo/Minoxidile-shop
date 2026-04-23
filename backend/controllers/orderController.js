import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import Stripe from 'stripe';
import { sendOrderEmail } from '../utils/emailService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const TAX_RATE = 0.08; // 8%
const SHIPPING_THRESHOLD = 100; // Free shipping above this amount

const calcPrices = (items, couponDiscount = 0) => {
    const itemsPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shippingPrice = itemsPrice >= SHIPPING_THRESHOLD ? 0 : 9.99;
    const discountAmount = couponDiscount;
    const taxableAmount = Math.max(0, itemsPrice - discountAmount);
    const taxPrice = Math.round(taxableAmount * TAX_RATE * 100) / 100;
    const totalPrice = Math.round((taxableAmount + shippingPrice + taxPrice) * 100) / 100;
    return { itemsPrice: Math.round(itemsPrice * 100) / 100, shippingPrice, taxPrice, discountAmount, totalPrice };
};

// @desc    Place new order
// @route   POST /api/orders
// @access  Private
export const placeOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod, coupon, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('Cart is empty');
    }

    // Validate stock
    for (const item of cart.items) {
        if (!item.product || !item.product.isActive) {
            res.status(400);
            throw new Error(`Product ${item.name} is no longer available`);
        }
        if (item.product.stock < item.qty) {
            res.status(400);
            throw new Error(`Insufficient stock for ${item.name}`);
        }
    }

    const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
        vendor: item.product.vendor,
    }));

    const couponDiscount = cart.coupon?.discount || 0;
    const prices = calcPrices(orderItems, couponDiscount);

    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        coupon: cart.coupon,
        notes,
        ...prices,
    });

    // Deduct stock
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.qty },
        });
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    const populated = await order.populate('items.product', 'name slug');
    res.status(201).json({ success: true, message: 'Order placed successfully', order: populated });
});

// @desc    Get my orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        Order.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Order.countDocuments({ user: req.user._id }),
    ]);

    res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (own order) or Admin
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to view this order');
    }

    res.json({ success: true, order });
});

// @desc    Mark order as paid (mock)
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'processing';
    order.paymentResult = req.body.paymentResult || { status: 'COMPLETED', id: `mock_${Date.now()}` };

    await order.save();

    // Send confirmation email
    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
    sendOrderEmail(populatedOrder, populatedOrder.user).catch(err => console.error('Order email failed:', err));

    res.json({ success: true, message: 'Order paid', order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized');
    }

    if (['shipped', 'delivered'].includes(order.status)) {
        res.status(400);
        throw new Error('Cannot cancel a shipped or delivered order');
    }

    // Restore stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ success: true, message: 'Order cancelled', order });
});

// === ADMIN ===

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = status ? { status } : {};

    const [orders, total] = await Promise.all([
        Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Order.countDocuments(query),
    ]);

    res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.status = status;
    if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
    }

    await order.save();
    res.json({ success: true, message: 'Order status updated', order });
});

// @desc    Create Stripe checkout session
// @route   POST /api/orders/:id/stripe-session
// @access  Private
export const createStripeSession = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    const lineItems = order.items.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
                images: [item.image],
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
    }));

    // Add tax and shipping as line items (simplified for Stripe)
    if (order.taxPrice > 0) {
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: { name: 'Tax (8%)' },
                unit_amount: Math.round(order.taxPrice * 100),
            },
            quantity: 1,
        });
    }

    if (order.shippingPrice > 0) {
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: { name: 'Shipping Fee' },
                unit_amount: Math.round(order.shippingPrice * 100),
            },
            quantity: 1,
        });
    }

    // Add discount as a negative item if any
    if (order.discountAmount > 0) {
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: { name: 'Discount Applied' },
                unit_amount: -Math.round(order.discountAmount * 100),
            },
            quantity: 1,
        });
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${order._id}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`,
        customer_email: req.user.email,
        metadata: { orderId: order._id.toString() },
    });

    res.json({ url: session.url });
});
