import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.get('/profile', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({ _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

router.put('/profile', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt,
            token: jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));


// --- NEW Wishlist Routes ---

// @desc    Get user's wishlist
// @route   GET /api/user/wishlist
// @access  Private
router.get('/wishlist', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

// @desc    Add product to wishlist
// @route   POST /api/user/wishlist
// @access  Private
router.post('/wishlist', protect, asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if (user && product) {
        if (user.wishlist.includes(productId)) {
            res.status(400);
            throw new Error('Product already in wishlist');
        }
        user.wishlist.push(productId);
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.status(201).json(updatedUser.wishlist);
    } else {
        res.status(404);
        throw new Error('User or Product not found');
    }
}));

// @desc    Remove product from wishlist
// @route   DELETE /api/user/wishlist/:productId
// @access  Private
router.delete('/wishlist/:productId', protect, asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (user) {
        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(updatedUser.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));


// --- NEW ADMIN-ONLY ROUTES ---

// @desc    Get all users
// @route   GET /api/user
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
}));

// @desc    Delete a user
// @route   DELETE /api/user/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if(user.isAdmin) {
            res.status(400);
            throw new Error('Cannot delete an admin user');
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

// @desc    Update user to be an admin
// @route   PUT /api/user/:id/toggleadmin
// @access  Private/Admin
router.put('/:id/toggleadmin', protect, admin, asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.isAdmin = !user.isAdmin;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

export default router;