import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        res.json(cart);
    } else {
        // If no cart, return an empty one.
        res.json({ items: [] });
    }
}));

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    
    // Find the product in the database to get its details
    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        // Cart exists, check if product is already in it
        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Product not in cart, add new item
            cart.items.push({ productId, quantity, price: product.price, title: product.title, image: product.image });
        }
    } else {
        // No cart for user, create a new one
        cart = new Cart({
            user: req.user._id,
            items: [{ productId, quantity, price: product.price, title: product.title, image: product.image }]
        });
    }

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
}));

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
}));

export default router;