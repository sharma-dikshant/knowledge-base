const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router = express.Router();

router.get("/userDetails/:employeeId", userController.getUserDetails);
router.post("/updateUser", authMiddleware, userController.updateUser);
router.post("/deleteUser", authMiddleware, userController.deleteUser);
router.get("/getUser", authController.protected, userController.getUser);

module.exports = router;
