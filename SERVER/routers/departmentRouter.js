const express = require("express");
const departmentController = require("../controller/departmentController");

const router = express.Router();

router.get("/getAllDepartment", departmentController.getDepartment);
router.post("/createDepartment", departmentController.createDepartment);

module.exports = router;
