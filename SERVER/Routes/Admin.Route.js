const {
  getRoles,
  createRole,
  createAdmin,
} = require("../controller/CreateRole.controller");
const express = require("express");
const router = express.Router();
router.post("/createAdmin", createAdmin);
router.post("/createRole", createRole);
router.get("/getRoles", getRoles);

module.exports = router;
