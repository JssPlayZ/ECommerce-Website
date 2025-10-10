import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Fetch all products with filtering, searching, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const pageSize = 8; // Products per page
    const page = Number(req.query.page) || 1;

    const keyword = req.query.search
        ? { title: { $regex: req.query.search, $options: 'i' } }
        : {};

    const categoryFilter = req.query.category && req.query.category !== 'all'
        ? { category: req.query.category }
        : {};

    const query = { ...keyword, ...categoryFilter };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
}));


// @desc    Fetch single product by its MongoDB _id
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    // This correctly validates the MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        throw new Error('Product not found (invalid ID format)');
    }
    
    const product = await Product.findById(req.params.id);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc    Get related products (by category)
// @route   GET /api/products/:id/related
// @access  Public
router.get('/:id/related', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        throw new Error('Product not found (invalid ID format)');
    }

    const mainProduct = await Product.findById(req.params.id);
    
    if (!mainProduct) {
        res.status(404);
        throw new Error('Product not found');
    }
    
    const relatedProducts = await Product.find({
        category: mainProduct.category,
        _id: { $ne: mainProduct._id }
    }).limit(4);

    res.json(relatedProducts);
}));


export default router;