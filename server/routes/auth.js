import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));

router.post('/register', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({ name, email, password });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));

// --- NEW: Google OAuth Routes ---

// @desc    Auth with Google
// @route   GET /api/auth/google
// @access  Public
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] // We ask Google for the user's profile and email
}));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: 'http://localhost:3000/login', // Redirect to login on fail
        session: false // We are using JWTs, not sessions
    }),
    (req, res) => {
        // --- Successful Authentication ---
        // passport attaches the user to req.user
        const user = req.user;
        
        // Create our own JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // Create the user object for the frontend
        const frontendUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: token
        };

        // Redirect the user back to the frontend, passing the user data as a query param
        // We will create a special /auth/callback page on the frontend to catch this.
        res.redirect(`http://localhost:3000/auth/callback?user=${encodeURIComponent(JSON.stringify(frontendUser))}`);
    }
);

export default router;