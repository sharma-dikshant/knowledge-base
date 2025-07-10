const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router = express.Router();

router.use(authController.protected);
router.get("/details/:employeeId", userController.getUserDetails);
router.patch("/:userId", userController.updateUser);
router.get("/getUser", userController.getUser);

router.use(authController.restrictTo("admin"));
router.delete("/:userId", userController.deleteUser);
router.get("/all", userController.getAllUser);
router.post("/", userController.createUser);
router.post("/multiple", userController.createUsersByCSV);

module.exports = router;
