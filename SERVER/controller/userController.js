const User = require("../models/userModel");
//TODO user controller
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

exports.getUser = (req, res) => {
  if (req.user) {
    return res.status(200).json({
      status: "success",
      data: req.user,
    });
  }

  return req.status(400).json({
    status: "failed",
    message: "No user Logged In",
  });
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ employeeId: req.params.employeeId });
    if (!user) {
      return res.status(400).json({
        message: "no user found!",
      });
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: "failed",
      message: error.message,
      error,
    });
  }
};
