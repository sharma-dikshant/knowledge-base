const express = require("express");
const departmentController = require("./../controller/departmentController");

const router = express.Router();

router.get("/all", departmentController.getAllDepartments);
router.post("/", departmentController.createDepartment);

module.exports = router;
