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

// --- NEW SALES DATA ROUTE ---

// @desc    Get sales data aggregated by day
// @route   GET /api/admin/sales-data
// @access  Private/Admin
router.get('/sales-data', protect, admin, asyncHandler(async (req, res) => {
    // Get sales data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo } // Filter orders in the last 30 days
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by day
                totalSales: { $sum: '$totalPrice' },
                count: { $sum: 1 } // Count orders per day
            }
        },
        {
            $sort: { _id: 1 } // Sort by date ascending
        },
        {
            $project: { // Rename _id to date for easier frontend use
                date: '$_id',
                totalSales: 1,
                count: 1,
                _id: 0
            }
        }
    ]);
    res.json(salesData);
}));

// --- NEW ORDER MANAGEMENT ROUTES ---

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, admin, asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
}));

// @desc    Mark order as delivered
// @route   PUT /api/admin/orders/:id/deliver
// @access  Private/Admin
router.put('/orders/:id/deliver', protect, admin, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}));

export default router;