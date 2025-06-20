const express = require("express");
const userController = require("../controller/userController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router = express.Router();

router.post("/createUser", authMiddleware, userController.createUser);
router.post("/updateUser", authMiddleware, userController.updateUser);
router.post("/deleteUser", authMiddleware, userController.deleteUser);

module.exports = router;
