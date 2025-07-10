const express = require("express");
const departmentController = require("./../controller/departmentController");
const authController = require("./../controller/authController");
const router = express.Router();

router.get("/all", departmentController.getAllDepartments);

router.use(authController.protected);
router.post("/", departmentController.createDepartment);

module.exports = router;
