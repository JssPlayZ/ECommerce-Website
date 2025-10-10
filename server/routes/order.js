import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart && cart.items.length > 0) {
        const order = new Order({
            user: req.user._id,
            products: cart.items.map(item => ({
                productId: item.productId,
                title: item.title,
                image: item.image,
                price: item.price,
                quantity: item.quantity
            })),
            totalPrice: cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0),
        });

        const createdOrder = await order.save();
        
        // Clear the user's cart after creating the order
        await Cart.deleteOne({ _id: cart._id });

        res.status(201).json(createdOrder);
    } else {
        res.status(400);
        throw new Error('No items in cart');
    }
}));

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
}));

export default router;