const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rolesMiddleware');

// Helper function to create a JWT token
const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('User already exists.');
    }

    // Create the new user with a default 'reader' role
    const newUser = await User.create({
        email,
        password: password,
        role: 'reader',
    });

    if (newUser) {
        res.status(201).json({
            id: newUser._id,
            email: newUser.email,
            token: createToken(newUser._id, newUser.role),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data.');
    }
}));

// @route   POST /api/auth/login
// @desc    Authenticate a user
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Check for the user's email
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error('Invalid credentials.');
    }

    // Compare the provided password with the stored hash
    //unhash user.password for testing
    const isMatch = await bcrypt.compare(req.body.password,user.password);
    if (user && isMatch) {
        res.json({
            id: user._id,
            email: user.email,
            token: createToken(user._id, user.role),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials.');
    }
}));

// @route   POST /api/auth/create-user
// @desc    Create a new user with a specified role (Admin only)
// @access  Private
router.post('/create-user', protect, requireRole('admin'), asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('User already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        email,
        password: hashedPassword,
        role,
    });

    if (newUser) {
        res.status(201).json({
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data.');
    }
}));

module.exports = router;
