const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const ApiFeature = require("./../utils/APIFeatures");
const ApiResponse = require("./../utils/ApiResponse");

exports.getAllUser = catchAsync(async (req, res, next) => {
  let baseQuery = User.find({});

  if (req.user.role === "admin" && req.query.inactive === "true") {
    baseQuery = baseQuery.onlyInActive();
  }

  const api = new ApiFeature(baseQuery)
    .paginate(req.query.page, req.query.limit)
    .sort(req.query.sort)
    .limitFields("-password -__v");

  const users = await api.query;
  return new ApiResponse(200, "fetched users", users).send(res);
});

exports.createUser = catchAsync(async (req, res, next) => {
  //TODO
  const newUser = await User.create(req.body);
  res.status(200).json({
    message: "success",
  });
});

exports.createUsersByCSV = catchAsync(async (req, res, next) => {
  //TODO
  res.status(200).json({
    message: "success",
  });
});

//update user
exports.updateUser = catchAsync(async (req, res, next) => {
  const newUser = await User.findByIdAndUpdate(req.params.userId, req.body, {
    runValidators: true,
    new: true,
  });
  if (!newUser) {
    return next(new AppError("user not found!", 404));
  }
  return new ApiResponse(200, "users updated successfully", newUser).send(res);
});

//delete userdata
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.userId });
  if (!user) return next(new AppError("no user found!", 404));

  await user.softDelete();
  return new ApiResponse(204, "user deleted successfully", null).send(res);
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

// TODO admin can fetch activities of inactive user
exports.getUserDetails = catchAsync(async (req, res, next) => {
  let baseQuery = User.find({});
  if (req.user.role === "admin") {
    baseQuery = baseQuery.allUsers();
  }
  const user = await baseQuery.findOne({ employeeId: req.params.employeeId });
  if (!user) {
    return next(new AppError("user not found!", 404));
  }
  return new ApiResponse(200, "user details fetched", user).send(res);
});
