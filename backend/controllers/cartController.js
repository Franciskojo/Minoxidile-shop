import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
        'items.product',
        'name slug images price salePrice stock isActive'
    );

    if (!cart) {
        return res.json({ success: true, cart: { items: [], subTotal: 0, totalItems: 0 } });
    }

    res.json({ success: true, cart });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, qty = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
        res.status(404);
        throw new Error('Product not found or unavailable');
    }

    if (product.stock < qty) {
        res.status(400);
        throw new Error(`Only ${product.stock} items available in stock`);
    }

    const price = product.salePrice > 0 && product.salePrice < product.price
        ? product.salePrice
        : product.price;

    const image = product.images?.[0]?.url || '';

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [{ product: productId, name: product.name, image, price, qty }],
        });
    } else {
        const existingIdx = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (existingIdx > -1) {
            const newQty = cart.items[existingIdx].qty + qty;
            if (newQty > product.stock) {
                res.status(400);
                throw new Error(`Only ${product.stock} items available in stock`);
            }
            cart.items[existingIdx].qty = newQty;
            cart.items[existingIdx].price = price;
        } else {
            cart.items.push({ product: productId, name: product.name, image, price, qty });
        }

        await cart.save();
    }

    const populated = await cart.populate('items.product', 'name slug images price salePrice stock');
    res.json({ success: true, message: 'Item added to cart', cart: populated });
});

// @desc    Update cart item qty
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
    const { qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
        res.status(404);
        throw new Error('Cart item not found');
    }

    const product = await Product.findById(item.product);
    if (product && qty > product.stock) {
        res.status(400);
        throw new Error(`Only ${product.stock} available`);
    }

    if (qty <= 0) {
        cart.items.pull(req.params.itemId);
    } else {
        item.qty = qty;
    }

    await cart.save();
    const populated = await cart.populate('items.product', 'name slug images price salePrice stock');
    res.json({ success: true, cart: populated });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }
    cart.items.pull(req.params.itemId);
    await cart.save();
    const populated = await cart.populate('items.product', 'name slug images price salePrice stock');
    res.json({ success: true, message: 'Item removed', cart: populated });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: 'Cart cleared' });
});
