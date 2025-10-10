import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Get user's cart, or create one if it doesn't exist
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            console.log(`No cart found for user ${req.user.id}, creating a new one.`);
            cart = new Cart({ user: req.user.id, items: [] });
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        console.error('Error fetching/creating cart:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
    // Only trust the product ID and quantity from the client
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findOne({ id: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
             return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId.toString());

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Product does not exist in cart, add new item using data from our database
            cart.items.push({
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        const updatedCart = await cart.save();
        res.status(201).json(updatedCart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
        
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;