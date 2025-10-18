import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, asyncHandler(async (req, res) => {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    // Calculate total revenue using an aggregation pipeline
    const totalRevenueResult = await Order.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: '$totalPrice' }
            }
        }
    ]);

    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    res.json({
        users: userCount,
        products: productCount,
        orders: orderCount,
        revenue: totalRevenue,
    });
}));

export default router;