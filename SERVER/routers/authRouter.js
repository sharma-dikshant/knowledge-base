const express = require("express");
const { Login, getCaptcha } = require("../controller/authController");
const loginLimiter = require("../Middleware/LoginAttemptMiddleware");
const sessionMiddleware = require("../Middleware/MiddlewareCaptcha");
const authMiddleware = require("../Middleware/AuthMiddleware");
router = express.Router();

router.get("/captcha", sessionMiddleware, getCaptcha);
router.post("/Login", loginLimiter, sessionMiddleware, Login);

module.exports = router;
