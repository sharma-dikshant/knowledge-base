const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const ApiFeature = require("./../utils/APIFeatures");
const ApiResponse = require("./../utils/ApiResponse");

const USER_STATUS = {
  ACTIVE: 1,
  INACTIVE: -1,
  ALL: 2,
};

const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
};

exports.getAllUser = catchAsync(async (req, res, next) => {
  let baseQuery = User.find({});

  if (req.user.role === USER_ROLES.ADMIN && req.query.active === "false") {
    baseQuery = baseQuery.find({ active: USER_STATUS.INACTIVE });
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
  if (user.role === USER_ROLES.ADMIN)
    return next(new AppError("you can't delete admin", 403));
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

//TODO admin is not able to se the details of inactive user
exports.getUserDetails = catchAsync(async (req, res, next) => {
  let baseQuery = User.find({});

  const user = await baseQuery.findOne({ employeeId: req.params.employeeId });

  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  return new ApiResponse(200, "User details fetched", user).send(res);
});

exports.changeRole = catchAsync(async (req, res, next) => {
  if (req.body.role && req.body.role === USER_ROLES.ADMIN) {
    return next(new AppError("Can't update role to admin", 403));
  }
  let user = await User.findOneAndUpdate(
    { employeeId: req.params.employeeId },
    {
      role: req.body.role,
    },
    { new: true }
  );

  if (!user) {
    return next(new AppError("No User found with given id", 404));
  }

  return new ApiResponse(200, "user role changed successfully!", user).send(
    res
  );
});
