const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Unauthorised"});
    }

    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded; //Attach user into to request

        //to put user id - apparnelty uses sub
        req.user = {
            id: decoded.sub,
            role: decoded.role
        
        }
        next();
    } catch(err){
        res.status(403).json({ message: "Token invalid or expired"});
    }
};

//Added for rbac
//require specific role
function requireRole(...roles){
    return (req, res, next) => {
        if(!req.user) {
            return res.status(401).json({ message: "Unauthorised"});
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message: "Forbudden: Insufficient role"});
        }

        next();
    };
}

function requireSelfOrRole(...roles){
    return (req, res, next) => {
        if (req.user.id === req.params.userId) return next();
        if (roles.includes(req.user.role)) return next();
        return res.status(403).json({ msg: "Forbidden"});
    };
}


module.exports = {protect, requireRole, requireSelfOrRole};