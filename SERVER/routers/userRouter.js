const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router = express.Router();

router.get("/userDetails/:employeeId", userController.getUserDetails);
router.post("/updateUser", authMiddleware, userController.updateUser);
router.delete("/deleteUser/:userId", authMiddleware, userController.deleteUser);
router.get("/getUser", authController.protected, userController.getUser);
router.get('/all-users', userController.getAllUser);

module.exports = router;
