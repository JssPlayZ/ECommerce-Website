import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- PUBLIC ROUTES ---

// @desc    Fetch paginated products
// @route   GET /api/products
router.get('/', asyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {};
    const categoryFilter = req.query.category && req.query.category !== 'all' ? { category: req.query.category } : {};
    const query = { ...keyword, ...categoryFilter };
    const count = await Product.countDocuments(query);
    const products = await Product.find(query).limit(pageSize).skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
}));


// --- ADMIN-ONLY ROUTES ---
// IMPORTANT: More specific routes must be defined BEFORE dynamic routes like /:id

// @desc    Get ALL products for admin (no pagination)
// @route   GET /api/products/all
// @access  Private/Admin
router.get('/all', protect, admin, asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
}));


// --- DYNAMIC PUBLIC ROUTES ---

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404); throw new Error('Product not found');
    }
    const product = await Product.findById(req.params.id);
    if (product) { res.json(product); } else { res.status(404); throw new Error('Product not found'); }
}));

// @desc    Get related products
// @route   GET /api/products/:id/related
router.get('/:id/related', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404); throw new Error('Product not found');
    }
    const mainProduct = await Product.findById(req.params.id);
    if (!mainProduct) { res.status(404); throw new Error('Product not found'); }
    const relatedProducts = await Product.find({ category: mainProduct.category, _id: { $ne: mainProduct._id } }).limit(4);
    res.json(relatedProducts);
}));


// --- MORE ADMIN-ONLY ROUTES ---

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
    const product = new Product({
        title: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        category: 'Sample category',
        description: 'Sample description',
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
}));

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const { title, price, description, image, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.title = title;
        product.price = price;
        product.description = description;
        product.image = image;
        product.category = category;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

export default router;