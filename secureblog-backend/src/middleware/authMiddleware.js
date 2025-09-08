const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// A secret key for signing and verifying JWTs.
// In a real application, this should be stored securely as an environment variable.
// const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTMwMTIwZjExNDU3NDNlN2VlYmJkOCIsImlhdCI6MTc1NDQ2NTM2NywiZXhwIjoxNzU0NDY4OTY3fQ.CKLzw3r9xCz30SpOSrexrTL2FpIvTLg53VWS5YNZUws';

/**
 * Middleware to protect routes by verifying a JWT.
 * It reads the token from the "Authorization" header in the format "Bearer <token>".
 */
const protect = asyncHandler(async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        // If no token is provided, the user is not authenticated.
        res.status(401);
        throw new Error('Not authorized, no token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the user's data (ID and role) to the request object.
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler.
    } catch (error) {
        // If the token is invalid or expired, deny access.
        res.status(401);
        throw new Error('Not authorized, token failed.');
    }
});

module.exports = { protect };
