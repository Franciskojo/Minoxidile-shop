import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Get all products (search, filter, sort, paginate)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    // Search
    if (req.query.search) {
        query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.rating) {
        query.rating = { $gte: Number(req.query.rating) };
    }

    // On sale filter
    if (req.query.onSale === 'true') {
        query.$expr = { $and: [{ $gt: ['$salePrice', 0] }, { $lt: ['$salePrice', '$price'] }] };
    }

    // Brand filter
    if (req.query.brand) {
        query.brand = { $regex: req.query.brand, $options: 'i' };
    }

    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price_asc') sort = { price: 1 };
    else if (req.query.sort === 'price_desc') sort = { price: -1 };
    else if (req.query.sort === 'rating') sort = { rating: -1 };
    else if (req.query.sort === 'newest') sort = { createdAt: -1 };
    else if (req.query.sort === 'popular') sort = { numReviews: -1 };

    const [products, total] = await Promise.all([
        Product.find(query)
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(limit),
        Product.countDocuments(query),
    ]);

    res.json({
        success: true,
        products,
        page,
        pages: Math.ceil(total / limit),
        total,
    });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true, isActive: true })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit);

    res.json({ success: true, products });
});

// @desc    Get top rated products
// @route   GET /api/products/top-rated
// @access  Public
export const getTopRated = asyncHandler(async (req, res) => {
    const products = await Product.find({ isActive: true, numReviews: { $gt: 0 } })
        .populate('category', 'name slug')
        .sort({ rating: -1, numReviews: -1 })
        .limit(6);

    res.json({ success: true, products });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
        .populate('category', 'name slug')
        .populate('vendor', 'name avatar');

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    res.json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Vendor/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const productData = { ...req.body };
    if (!productData.vendor) productData.vendor = req.user._id;

    const product = await Product.create(productData);
    const populated = await product.populate('category', 'name slug');
    res.status(201).json({ success: true, message: 'Product created', product: populated });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Vendor/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Only owner or admin can update
    if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to update this product');
    }

    Object.assign(product, req.body);
    await product.save();

    const populated = await product.populate('category', 'name slug');
    res.json({ success: true, message: 'Product updated', product: populated });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Vendor/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Only owner or admin can delete
    if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to delete this product');
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const related = await Product.find({
        category: product.category,
        _id: { $ne: product._id },
        isActive: true,
    })
        .populate('category', 'name slug')
        .limit(6);

    res.json({ success: true, products: related });
});
