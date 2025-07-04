const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Solution = require("../models/solutionModal");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");
const PostFeature = require("../utils/PostFeature");

const applyDepartmentalFilter = (req) => {
  let departmentfilter;
  if (req.user) {
    // if user is logged in then we can show the private post of its department
    // query = query.$
    if (req.user.role === "admin" || req.user.role === "moderator") {
      departmentfilter = { $or: [{ private: false }, { private: true }] };
    } else {
      departmentfilter = {
        $or: [
          { private: false },
          { private: true, department: req.user.department },
        ],
      };
    }
  } else {
    departmentfilter = { private: false };
  }
  return departmentfilter;
};

const applyStatusFilter = (req) => {
  let statusFilter;
  const reqStatus = req.query.status || 2; // default verified

  if (req.user) {
    if (req.user.role === "admin") {
      statusFilter = { status: reqStatus }; // can see post with any status
    } else if (req.user.role === "moderator") {
      // can see post with any status but of there own department
      statusFilter = {
        department: req.user.department,
        status: req.query.status,
      };
    } else if (req.user.role === "user") {
      // can only see the there own post whose status matched with given status
      statusFilter = {
        author: req.user._id,
        status: req.query.status,
      };
    }
  } else {
    statusFilter = { status: 2 }; // show only verified posts
  }

  return statusFilter;
};

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({ ...req.body, author: req.user._id });
  return res.status(200).json({
    message: "post created successfully!",
    data: newPost,
  });
});

exports.updatePost = async (req, res, next) => {
  const newPost = await Post.findOneAndUpdate(
    { ...applyDepartmentalFilter(req), _id: req.params.postId },
    req.body,
    {
      new: true,
    }
  );
  if (!newPost) {
    return next(new AppError("no post found with given id", 404));
  }
  return res.status(200).json({
    message: "post updated successfully",
    data: newPost,
  });
};

exports.getPostbyAuthor = catchAsync(async (req, res, next) => {
  const posts = await Post.find({
    ...applyDepartmentalFilter(req),
    author: req.params.authorId,
  });
  return res.status(200).json({
    message: "success",
    posts,
  });
});

exports.getPostDetails = async (req, res, next) => {
  const post = await Post.findOne({
    ...applyDepartmentalFilter(req),
    _id: req.params.postId,
  }).populate("author");
  if (!post) {
    return next(new AppError("not Found", 404));
  }
  const commentsLimit = parseInt(req.query.comments) || 10;
  const solutionLimit = parseInt(req.query.solutions) || 1;
  const comments = await Comment.find({ post: req.params.postId })
    .sort("-createdAt")
    .limit(commentsLimit);
  const solutions = await Solution.find({ post: req.params.postId })
    .sort("-createdAt")
    .limit(solutionLimit);

  return res.status(200).json({
    message: "success",
    post,
    comments,
    solutions,
  });
};

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let baseQuery = Post.find({
    ...applyDepartmentalFilter(req),
    ...applyStatusFilter(req),
  });
  const api = new APIFeatures(baseQuery)
    .sort(req.query.sort)
    .paginate(req.query.page, req.query.limit)
    .limitFields();

  if (req.query.department) {
    api.query = api.query.find({ department: req.query.department });
  }

  const features = new PostFeature(api.query);
  features.populateAuthor();

  let posts = await features.query.lean();

  if (req.query.comments) {
    posts = await features.populateComments(posts, 5, "-createdAt");
  }

  if (req.query.solutions) {
    posts = await features.populateSolution(posts, 1, "-createdAt");
  }

  return res
    .status(200)
    .json({ message: "Post fetched sucessfully", data: posts });
});

// delete post >
exports.deletePost = catchAsync(async (req, res, next) => {
  const deletedPost = await Post.findOneAndDelete(
    { ...applyDepartmentalFilter(req), _id: req.params.postId },
    {
      new: true,
    }
  );
  if (!deletedPost) {
    return next(new AppError("no post found!", 400));
  }
  return res.status(204).json({
    message: "success",
  });
});
//upvote Post
exports.upVote = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  //1 check if user already upvoted
  let post = await Post.findById(postId);
  if (!post || !userId) {
    return next(
      new AppError(!userId ? "userId is not provided" : "no post found", 400)
    );
  }
  //2 remove from downVote if presen
  post.downVotes = post.downVotes.filter(
    (uid) => uid.toString() !== userId.toString()
  );

  //3 add to upVote if not Present
  if (!post.upVotes.some((uid) => uid.toString() === userId.toString())) {
    post.upVotes.push(userId);
    post.votes += 1;
  }

  await post.save();

  return res.status(200).json({
    message: "success",
    votes: post.votes,
  });
});

//Downvote

exports.downVote = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  //1 check if user already upvoted
  let post = await Post.findById(postId);
  if (!post || !userId) {
    return next(
      new AppError(!userId ? "userId is not provided" : "no post found", 400)
    );
  }
  //2 remove from upVotes if presen
  post.upVotes = post.upVotes.filter(
    (uid) => uid.toString() !== userId.toString()
  );

  //3 add to downVote is not Present
  if (
    !post.downVotes.some((uid) => uid.toString() === userId.toString()) &&
    post.votes > 0
  ) {
    post.votes -= 1;
    post.downVotes.push(userId);
  }

  await post.save();

  return res.status(200).json({
    message: "success",
    votes: post.votes,
  });
});

exports.getVotes = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return next(new AppError("no post found!", 400));
  }

  return res.status(200).json({
    status: "success",
    votes: post.votes,
  });
});

//createcommet

exports.getTopUpvotedPosts = catchAsync(async (req, res, next) => {
  // Fetch all posts and sort by Upvote count (length of Upvote array) in descending order
  const topPosts = await Post.find(applyDepartmentalFilter(req))
    .sort({ upVotes: -1 }) // Sorts based on the number of upvotes
    .limit(5); // Retrieves the top 5 posts

  if (topPosts.length == 0) {
    return res.status(404).json({ message: "No posts found" });
  }
  return res.status(200).json({
    status: "success",
    data: topPosts,
  });
});

exports.searchPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find({
    ...applyDepartmentalFilter(req),
    $text: { $search: req.query.query },
  }).select("_id title");
  if (posts.length == 0) {
    return next(new AppError("no posts found!", 404));
  }
  return res.status(200).json({ message: "success", posts });
});

/**
 *  Controller functions for managing status of posts
 */

exports.approvePost = catchAsync(async (req, res, next) => {
  await Post.findOneAndUpdate({ _id: req.params.postId }, { status: 2 });
  res.status(200).json({
    message: "post approved!",
  });
});
exports.rejectPost = catchAsync(async (req, res, next) => {
  await Post.findOneAndUpdate({ _id: req.params.postId }, { status: 3 });
  res.status(200).json({
    message: "post rejected!",
  });
});
