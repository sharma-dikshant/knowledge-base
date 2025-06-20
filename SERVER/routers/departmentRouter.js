const express = require("express");
const {
  GetDepartment,
  DepartmentController,
} = require("../controller/departmentController");

const router = express.Router();

router.get("/getAllDepartment", GetDepartment);
router.post("/CreateDepartment", DepartmentController);

module.exports = router;
