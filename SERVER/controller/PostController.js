const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Solution = require("../models/solutionModal");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");
const PostFeature = require("../utils/PostFeature");
const ApiResponse = require("../utils/ApiResponse");

const POST_STATUS_CODES = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
};

/**
 *        HELPER FUNCTIONS
 */

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
  const reqStatus = req.query.status; // default verified
  const statusQ = [];
  if (req.user) {
    if (req.user.role === "admin") {
      statusFilter = { status: reqStatus || 2 }; // can see post with any status
    } else if (req.user.role === "moderator") {
      // can see post with any status but of there own department
      if (reqStatus) {
        statusQ.push({ department: req.user.department, status: reqStatus });
      } else {
        statusQ.push({ status: POST_STATUS_CODES.APPROVED });
      }
      statusFilter = {
        $or: statusQ,
      };
    } else if (req.user.role === "user") {
      // can only see the there own post whose status matched with given status
      if (reqStatus) {
        statusQ.push({ author: req.user._id, status: reqStatus });
      } else {
        statusQ.push({ status: POST_STATUS_CODES.APPROVED });
      }
      statusFilter = {
        $or: statusQ,
      };
    }
  } else {
    statusFilter = { status: 2 }; // show only verified posts
  }
  return statusFilter;
};

/**
 *        Create, Update, Delete operations on posts
 */

//TODO department referencing
exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({ ...req.body, author: req.user._id });
  return new ApiResponse(200, "post created successfully", newPost).send(res);
});

exports.updatePost = async (req, res, next) => {
  const newPost = await Post.findOneAndUpdate(
    { ...applyDepartmentalFilter(req), _id: req.params.postId },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  if (!newPost) {
    return next(new AppError("no post found with given id", 404));
  }
  return new ApiResponse(200, "post updated successfully", newPost).send(res);
};

// delete post >
exports.deletePost = catchAsync(async (req, res, next) => {
  const deletedPost = await Post.findOne({
    ...applyDepartmentalFilter(req),
    _id: req.params.postId,
  });
  if (!deletedPost) {
    return next(new AppError("no post found!", 404));
  }

  await deletedPost.softDelete();

  return new ApiResponse(204, "post deleted successfully", null).send(res);
});

/**
 * ================================================================================
 */

/**
 *      Read Posts
 */

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let baseQuery = Post.find({
    $and: [applyStatusFilter(req), applyDepartmentalFilter(req)],
  });
  /**
   * Displaying inactive posts to admin only
   */

  if (req?.user?.role === "admin" && req.query.inactive === "true") {
    baseQuery = baseQuery.onlyInActive();
  }

  const api = new APIFeatures(baseQuery)
    .sort(req.query.sort)
    .paginate(req.query.page, req.query.limit)
    .limitFields();

  if (req.query.department && req.query.department !== "all") {
    api.query = api.query.find({ department: req.query.department });
  }

  const features = new PostFeature(api.query)
    .populateAuthor()
    .populateStatusChangedByUser();

  let posts = await features.query.lean();

  if (req.query.comments) {
    posts = await features.populateComments(posts, 5, "-createdAt");
  }

  if (req.query.solutions) {
    posts = await features.populateSolution(posts, 1, "-createdAt");
  }

  return new ApiResponse(200, "posts fetched successfully", posts).send(res);
});

exports.getPostbyAuthor = catchAsync(async (req, res, next) => {
  let baseQ = {
    author: req.params.authorId,
  };

  if (
    req.query.status &&
    req.user &&
    req.user._id.toString() === req.params.authorId.toString()
  ) {
    baseQ = { ...baseQ, status: req.query.status };
  }

  const posts = await Post.find(baseQ).populate(
    "statusChangedBy.user",
    "employeeId name"
  );
  return new ApiResponse(200, "posts fetched successfully", posts).send(res);
});

exports.getPostDetails = async (req, res, next) => {
  const post = await Post.findOne({
    ...applyDepartmentalFilter(req),
    _id: req.params.postId,
  })
    .populate("author", "name employeeId")
    .populate("statusChangedBy.user", "employeeId name");

  if (!post) {
    return next(new AppError("not Found", 404));
  }
  const commentsLimit = parseInt(req.query.comments) || 10;
  const solutionLimit = parseInt(req.query.solutions) || 1;
  const comments = await Comment.find({ post: req.params.postId })
    .populate("author", "name employeeId")
    .sort("-createdAt")
    .limit(commentsLimit);
  const solutions = await Solution.find({ post: req.params.postId })
    .populate("author", "name employeeId")
    .sort("-createdAt")
    .limit(solutionLimit);

  return new ApiResponse(200, "post details fetched!", {
    post,
    comments,
    solutions,
  }).send(res);
};
//TODO yet not implemented
exports.getTopUpvotedPosts = catchAsync(async (req, res, next) => {
  // Fetch all posts and sort by Upvote count (length of Upvote array) in descending order
  const topPosts = await Post.find(applyDepartmentalFilter(req))
    .sort({ upVotes: -1 }) // Sorts based on the number of upvotes
    .limit(5); // Retrieves the top 5 posts

  if (topPosts.length == 0) {
    return res.status(404).json({ message: "No posts found" });
  }

  return new ApiResponse(200, "top voted posts fetched", topPosts).send(res);
});

exports.searchPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find({
    $and: [applyDepartmentalFilter(req), applyStatusFilter(req)],
    $text: { $search: req.query.query },
  }).select("_id title");
  if (posts.length == 0) {
    return next(new AppError("no posts found!", 404));
  }
  return new ApiResponse(200, "post found!", posts).send(res);
});

/**
 *      VOTING POSTS
 */

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

  return new ApiResponse(200, "upvoted!", { votes: post.votes }).send(res);
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

  return new ApiResponse(200, "downvoted!", { votes: post.votes }).send(res);
});

exports.getVotes = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return next(new AppError("no post found!", 400));
  }

  return new ApiResponse(200, "votes fetched!", { votes: post.votes }).send(
    res
  );
});

/**
 *  POST ACTIONS FOR ADMIN
 */

exports.approvePost = catchAsync(async (req, res, next) => {
  const changedStatus = {
    user: req.user._id,
    action: POST_STATUS_CODES.APPROVED,
    at: Date.now(),
  };
  await Post.findOneAndUpdate(
    { _id: req.params.postId },
    { status: 2, statusChangedBy: changedStatus }
  );

  return new ApiResponse(200, "post approved!", null).send(res);
});
exports.rejectPost = catchAsync(async (req, res, next) => {
  const changedStatus = {
    user: req.user._id,
    action: POST_STATUS_CODES.REJECTED,
    at: Date.now(),
  };
  await Post.findOneAndUpdate(
    { _id: req.params.postId },
    { status: 3, statusChangedBy: changedStatus }
  );

  return new ApiResponse(200, "post rejected!", null).send(res);
});
