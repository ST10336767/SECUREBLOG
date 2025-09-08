// Middleware to check if the user has a specific role.
// It requires the `protect` middleware to be used first.
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        // Check if the user object was attached by the `protect` middleware.
        if (!req.user || !req.user.role) {
            res.status(403);
            throw new Error('Access denied. User role not found.');
        }

        // Check if the user's role matches the required role.
        if (req.user.role !== requiredRole) {
            res.status(403);
            throw new Error(`Access denied. ${requiredRole} role required.`);
        }

        next(); // User has the correct role; proceed.
    };
};

// Middleware for ownership checks, combined with role-based access.
// This allows a user to access a resource if they are the owner OR they have the required role.
const requireSelfOrRole = (requiredRole, getResourceIdFromRequest) => {
    return (req, res, next) => {
        // First, check if the user has the required role.
        if (req.user && req.user.role === requiredRole) {
            return next(); // If they have the role, grant access.
        }

        // If not, check if they are the owner of the resource.
        const resourceId = getResourceIdFromRequest(req);
        if (req.user && req.user.id === resourceId) {
            return next(); // They are the owner, grant access.
        }

        // If they are neither the owner nor have the required role, deny access.
        res.status(403);
        throw new Error('Access denied. You are not the owner or do not have the required role.');
    };
};

module.exports = {
    requireRole,
    requireSelfOrRole
};
