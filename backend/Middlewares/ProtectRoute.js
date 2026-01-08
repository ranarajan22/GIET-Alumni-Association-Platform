const jwt = require("jsonwebtoken");
const User = require("../Models/users");
const Alumni = require("../Models/alumni");

const protectRoute = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Try to find user in User model first (students)
        let user = await User.findById(decoded.userId);
        
        // If not found in User model, try Alumni model
        if (!user) {
            user = await Alumni.findById(decoded.userId);
        }
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        req.user = user; // Attach user object to the request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }
};

module.exports = protectRoute;
