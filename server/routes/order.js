const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new order from the cart
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cannot create order from an empty cart' });
        }
        
        const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = new Order({
            user: userId,
            products: cart.items.map(item => ({
                productId: item.productId,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
            })),
            totalPrice: totalPrice
        });

        const createdOrder = await order.save();
        
        // Clear the user's cart after creating the order
        cart.items = [];
        await cart.save();

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error('Error creating order:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }); // Show newest first
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;