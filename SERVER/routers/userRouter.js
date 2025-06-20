const express = require("express");
const {
  createUser,
  updateUser,
  DeleteUser,
} = require("../controller/userController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router = express.Router();

router.post("/createUser", authMiddleware, createUser);
router.post("/updateUser", authMiddleware, updateUser);
router.post("/DeleteUser", authMiddleware, DeleteUser);

module.exports = router;
