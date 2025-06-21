const express = require("express");
const userController = require("../controller/userController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router = express.Router();

router.post("/updateUser", authMiddleware, userController.updateUser);
router.post("/deleteUser", authMiddleware, userController.deleteUser);

module.exports = router;
