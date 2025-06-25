const Comment = require("./../models/commentModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

exports.createComment = catchAsync(async (req, res, next) => {
  const newComment = await Comment.create({
    ...req.body,
    author: req.user._id,
    post: req.params.postId,
  });

  return res.status(201).json({
    message: "success",
    data: newComment,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const deletedComment = await Comment.findByIdAndDelete(req.params.commentId, {
    new: true,
  });
  if (!deletedComment) {
    return next(new AppError("no doc found!", 400));
  }
  return res.status(204).json({
    status: "success",
  });
});

exports.getAllPostComment = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId }).populate(
    "author"
  );

  return res.status(200).json({
    status: "success",
    comments,
  });
});
