const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const ApiFeature = require("./../utils/APIFeatures");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const baseQuery = User.find({});
  const api = new ApiFeature(baseQuery)
    .paginate(req.query.page, req.query.limit)
    .sort(req.query.sort)
    .limitFields("-password -__v");

  const users = await api.query;
  res.status(200).json({
    status: "success",
    message: "fetched users",
    data: users,
  });
});
//update user
exports.updateUser = catchAsync(async (req, res, next) => {
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
});

//delete userdata
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.userId, { new: true });
  if (!user) return next(new AppError("no user found!", 404));
  return res.status(204).json({
    message: "successfully deleted user",
  });
});

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

exports.getUserDetails = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ employeeId: req.params.employeeId });
  if (!user) {
    return next(new AppError("user user found!", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
