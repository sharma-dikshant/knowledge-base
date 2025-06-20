const rateLimit = require("express-rate-limit");

// Limit login attempts (5 per 15 minutes)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests
    message: "Too many login attempts, please try again later.",
    standardHeaders: true, 
    legacyHeaders: false,
});

module.exports=loginLimiter