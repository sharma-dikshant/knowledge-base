const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const authMiddleware = (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.secretKey);
        } catch (error) {
            return res.status(403).json({ message: "Invalid token. Please log in again." });
        }

        // Attach user ID to the request
        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(401).json({ message: "Authentication failed.", error });
    }
};

module.exports = authMiddleware;
