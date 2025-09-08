const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// A simple in-memory "database" to simulate user storage.
// In a real application, you would connect to a database like MongoDB or PostgreSQL.
let users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// A function to generate a unique ID for new users.
let nextUserId = 1;
function generateId() {
  return nextUserId++;
}

// A middleware to protect routes, ensuring only authenticated users can access them.
// It also attaches the user's data (id and role) to the request object.
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
}

// An admin-specific middleware to ensure the user has the 'admin' role.
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
}

// Create an Express router for authentication routes.
const router = express.Router();

// Route for user registration.
// Issues a JWT with a default 'reader' role.
router.post('/register', async (req, res) => {
    try{
    const { email, password } = req.body;

    // Check if a user with the same email already exists.
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'Email already exists.' });
    }

    // Hash the password for security.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with a default 'reader' role.
    const newUser = {
        id: generateId(),
        email,
        password: hashedPassword,
        role: 'reader' // Default role
    };

    users.push(newUser);

    // Create a JWT with the user's ID and role.
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, message: 'User registered successfully.' });
}catch(error){
    res.status(500).json({ message: 'Server error during registration.' });
    console.log(error);
}
});

// Route for user login.
// Verifies credentials and issues a JWT.
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email.
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare the provided password with the stored hashed password.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Issue a new JWT token containing the user's ID and role.
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Login successful.' });
});

// Admin-only route for creating new users with specific roles.
router.post('/admin/register', verifyToken, isAdmin, async (req, res) => {
    const { email, password, role } = req.body;

    // Check if the provided role is valid (e.g., 'reader', 'editor', 'admin').
    // This is a simple validation, you might have more complex rules.
    const allowedRoles = ['reader', 'editor', 'admin'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided.' });
    }

    // Check if a user with the same email already exists.
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'Email already exists.' });
    }

    // Hash the password.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with the specified role.
    const newUser = {
        id: generateId(),
        email,
        password: hashedPassword,
        role: role // Use the role from the request body.
    };

    users.push(newUser);

    // Create a JWT for the new user.
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, message: `User with role '${role}' created successfully.` });
});

// A simple protected test route to demonstrate that the token and role check works.
// Requires a valid JWT to access.
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'This is a protected route.',
        userId: req.user.id,
        userRole: req.user.role
    });
});

module.exports = router;