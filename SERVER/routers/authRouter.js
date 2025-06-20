const express = require("express");
const authController = require("../controller/authController");
const loginLimiter = require("../Middleware/LoginAttemptMiddleware");
const sessionMiddleware = require("../Middleware/MiddlewareCaptcha");
const authMiddleware = require("../Middleware/AuthMiddleware");
router = express.Router();

router.get("/captcha", sessionMiddleware, authController.getCaptcha);
router.post("/Login", loginLimiter, sessionMiddleware, authController.login);

module.exports = router;
