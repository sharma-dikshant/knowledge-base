const express = require("express");
const authController    = require("../controller/authController");
const loginLimiter      = require("../Middleware/LoginAttemptMiddleware");
const sessionMiddleware = require("../Middleware/MiddlewareCaptcha");

router = express.Router();

router.get("/captcha", sessionMiddleware, authController.getCaptcha);
router.post("/login", loginLimiter, sessionMiddleware, authController.login);
router.post("/signup", authController.signUp);
router.post("/logout", authController.logout);

module.exports = router;
