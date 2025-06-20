// Create a new Role
const Roles = require("../Models/Role.model");
const User = require("../Models/User.model");
const bcrypt = require("bcryptjs");
const createRole = async (req, res) => {
  try {
    const { Role, RoleId } = req.body;

    // Validation
    if (!Role) {
      return res.status(400).json({ message: "Role name is required" });
    }
    if (!RoleId) {
      return res.status(400).json({ message: "RoleID name is required" });
    }

    // Check if Role already exists
    const existingRole = await Roles.findOne({ RoleId });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    // Create and save new role
    const newRole = new Roles({ Role, RoleId });
    await newRole.save();

    res
      .status(201)
      .json({ message: "Role created successfully", role: newRole });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get all Roles
const getRoles = async (req, res) => {
  try {
    const roles = await Roles.find(); // Fetch all roles
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const createAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    const admin = await User.create({ ...req.body, Password: hashedPassword });
    // console.log((req.body))
    res.status(200).json({
      status: "success",
      data: admin,
    });
  } catch (error) {
    console.log("error in creating user: ", error);
    res.status(500).json({ message: "Failed", error });
  }
};

module.exports = { createRole, getRoles, createAdmin };
