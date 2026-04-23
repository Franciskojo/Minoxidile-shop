import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
    const includeInactive = req.query.all === 'true' && req.user?.role === 'admin';
    const query = includeInactive ? {} : { isActive: true };

    const categories = await Category.find(query)
        .populate('parent', 'name slug')
        .sort({ order: 1, name: 1 });

    res.json({ success: true, categories });
});

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug }).populate('parent', 'name slug');
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.json({ success: true, category });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
export const createCategory = asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, message: 'Category created', category });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    Object.assign(category, req.body);
    await category.save();
    res.json({ success: true, message: 'Category updated', category });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted' });
});
