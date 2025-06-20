const {
  getRoles,
  createRole,
  createAdmin,
} = require("../controller/roleController");
const express = require("express");
const router = express.Router();
router.post("/createAdmin", createAdmin);
router.post("/createRole", createRole);
router.get("/getRoles", getRoles);

module.exports = router;
