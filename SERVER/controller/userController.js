const User = require("../models/userModel");
const Roles = require("../models/roleModel");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const {
      username,
      employeeCode,
      role,
      Grade,
      Department,
      Email,
      Password,
      roleId,
    } = req.body;

    if (
      !username ||
      !employeeCode ||
      !role ||
      !Grade ||
      !Department ||
      !Email ||
      !Password ||
      !roleId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log(employeeCode);
    const roleExists = await Roles.findOne({ RoleId: roleId });
    if (!roleExists) {
      return res.status(404).json({ message: "Role not found" });
    }

    const existingUser = await User.findOne({ EmployeeCode: employeeCode });
    if (existingUser) {
      return res.status(400).json({ message: "user already exist" });
    }

    const hashedpassword = await bcrypt.hash(Password, 10);
    if (!role.includes("user")) {
      role.push("user");
    }
    if (!roleId.includes(1)) {
      roleId.push(2);
    }
    const newUser = new User({
      Username: username,
      EmployeeCode: employeeCode,
      Role: role,
      RoleId: roleId,
      Grade: Grade,
      Department: Department,
      Email: Email,
      Password: hashedpassword,
    });
    await newUser.save();
    console.log("i am here");
    res.status(201).json({ message: "user create successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error", error });
  }
};
//update user

exports.updateUser = async (req, res) => {
  try {
    const { employeeCode, ...updateFields } = req.body; // Extract `employeeCode` and other fields

    if (!employeeCode) {
      return res
        .status(400)
        .json({ message: "EmployeeCode is required to update user" });
    }

    const userData = await User.findOne({ EmployeeCode: employeeCode });
    if (!userData) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Filter out undefined or empty fields before updating
    const filteredUpdates = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    // If no valid fields are provided, return an error
    if (Object.keys(filteredUpdates).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    // Update user data
    const updatedData = await User.findByIdAndUpdate(
      userData._id,
      filteredUpdates,
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "User updated successfully", updatedData });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

//delete userdata

exports.deleteUser = async (req, res) => {
  try {
    const { employeeCode } = req.body;
    if (!employeeCode) {
      console.log("no employeecode");

      return res
        .status(400)
        .json({ message: "unable to delete please provide uesrId" });
    }

    await User.findOneAndDelete({ EmployeeCode: employeeCode });
    return res.status(201).json({ message: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
