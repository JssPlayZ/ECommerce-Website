import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find the user by the ID from the token
            const user = await User.findById(decoded.id).select('-password');

            // --- THIS IS THE CRUCIAL FIX ---
            // If we found a user, attach it to the request and proceed.
            if (user) {
                req.user = user;
                next();
            } else {
                // If no user was found for this ID, it's an invalid token.
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

export { protect, admin };