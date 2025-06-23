const Post = require("../models/postModel");
const Solution = require("./../models/solutionModal");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

exports.createSolution = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return next(new AppError("no post found!", 400));
  }

  const newDoc = await Solution.create({
    post: req.params.postId,
    ...req.body,
    author: req.user._id,
  });

  return res.status(200).json({
    message: "solution added successful!",
    data: newDoc,
  });
});

exports.updateSolution = catchAsync(async (req, res, next) => {
  const newDoc = await Solution.findByIdAndUpdate(
    req.params.solutionId,
    { description: req.body.description },
    { new: true }
  );

  if (!newDoc) {
    return next(new AppError("No Solution Found!", 400));
  }

  return res.status(200).json({
    message: "solution updated successfully!",
    data: newDoc,
  });
});

exports.getSolution = catchAsync(async (req, res, next) => {
  const doc = await Solution.findById(req.params.solutionId);
  if (!doc) {
    return next(new AppError("No Solution Found!", 404));
  }

  return res.status(200).json({
    data: doc,
  });
});

exports.deleteSolution = catchAsync(async (req, res, next) => {
  const doc = await Solution.findByIdAndDelete(req.params.solutionId, {
    new: true,
  });

  if (!doc) {
    return next(new AppError("No Solution Found!"));
  }
  return res.status(204).json({
    message: "solution deleted successfully",
  });
});
