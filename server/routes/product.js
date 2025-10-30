import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get('/', asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {};
    const categoryFilter = req.query.category && req.query.category !== 'all' ? { category: req.query.category } : {};

    const sortOrder = req.query.sort || 'latest';
    let sortQuery = {};
    switch (sortOrder) {
        case 'price-asc': sortQuery = { price: 1, _id: 1 }; break; // Added _id secondary sort
        case 'price-desc': sortQuery = { price: -1, _id: 1 }; break;// Added _id secondary sort
        case 'rating': sortQuery = { rating: -1, _id: 1 }; break; // Added _id secondary sort
        case 'latest': default: sortQuery = { createdAt: -1, _id: 1 }; break; // Added _id secondary sort
    }

    const query = { ...keyword, ...categoryFilter };
    const count = await Product.countDocuments(query);

    const products = await Product.find(query)
        .sort(sortQuery) // Use the combined sort query
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), pageSize });
}));

// ... all other GET, POST, PUT, DELETE routes ...
// --- ADMIN-ONLY ROUTES (must be before /:id) ---
router.get('/all', protect, admin, asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
}));

// --- DYNAMIC PUBLIC ROUTES ---
router.get('/:id', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404); throw new Error('Product not found');
    }
    const product = await Product.findById(req.params.id);
    if (product) { res.json(product); } else { res.status(404); throw new Error('Product not found'); }
}));

router.get('/:id/related', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404); throw new Error('Product not found');
    }
    const mainProduct = await Product.findById(req.params.id);
    if (!mainProduct) { res.status(404); throw new Error('Product not found'); }
    const relatedProducts = await Product.find({ category: mainProduct.category, _id: { $ne: mainProduct._id } }).limit(4);
    res.json(relatedProducts);
}));

// --- REVIEW ROUTE ---
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400); throw new Error('Product already reviewed');
        }
        const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id, };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404); throw new Error('Product not found');
    }
}));

// --- ADMIN-ONLY CUD ROUTES ---
router.post('/', protect, admin, asyncHandler(async (req, res) => {
    const product = new Product({
        title: 'Sample name', price: 0, user: req.user._id, image: '/images/sample.jpg', category: 'Sample category', description: 'Sample description', numReviews: 0, rating: 0
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
}));

router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const { title, price, description, image, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.title = title; product.price = price; product.description = description; product.image = image; product.category = category;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404); throw new Error('Product not found');
    }
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        const imagePath = product.image;

        // Check if the image path points to a local upload
        if (imagePath && imagePath.startsWith('/uploads/')) {
            const __dirname = path.resolve();
            const filePath = path.join(__dirname, imagePath);
        
            try {
                // Try to delete the file
                await fs.unlink(filePath);
                console.log(`Successfully deleted image: ${filePath}`);
            } catch (err) {
                // Log an error if the file doesn't exist, but don't stop the process
                console.error(`Failed to delete image: ${filePath}. Error: ${err.message}`);
            }
        }

        // Proceed to delete the product from the database
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

export default router;