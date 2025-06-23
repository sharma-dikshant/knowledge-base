const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Solution = require("../models/solutionModal");

exports.createPost = async (req, res) => {
  try {
    // const newPost = await Post.create(req.body, { new: true });
    const newPost = await Post.create({ ...req.body, author: req.user._id });

    return res.status(200).json({
      status: "success",
      data: newPost,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.message,
      error,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const newPost = await Post.findByIdAndUpdate(req.params.postId, req.body, {
      new: true,
    });
    if (!newPost) {
      return res.status(400).json({
        status: "failed",
        message: "no post found with given id",
      });
    }
    return res.status(200).json({
      status: "success",
      data: newPost,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.mesage,
      error,
    });
  }
};

exports.getPostbyAuthor = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.authorId });
    return res.status(200).json({
      status: "success",
      posts,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.mesage,
      error,
    });
  }
};

exports.getPostDetails = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate("author");
    if (!post) {
      return res.status(404).json({
        message: "not Found",
      });
    }

    const comments = await Comment.find({ post: req.params.postId })
      .sort("-createdAt")
      .limit(10);
    const solutions = await Solution.find({ post: req.params.postId })
      .sort("-createdAt")
      .limit(1);

    return res.status(200).json({
      post,
      comments,
      solutions,
    });
  } catch (error) {}
  return res.status(200).json({
    message: "post data",
  });
};

exports.getAllPosts = async (req, res) => {
  // sorting
  // pagination
  try {
    let query = Post.find();

    /**
     * if department is given
     */

    if (req.query.department && req.query.department != "all") {
      query = query.find({ department: req.query.department });
    }
    /**
     * sorting
     * based of time of created => createdAt, -createdAt
     * based of votes => votes, -votes
     */
    if (req.query.sort) {
      const sortQ = req.query.sort.split(",").join(" ");
      query = query.sort(sortQ);
    }

    /**
     * Pagination
     * page => page no
     * limit => no. of results
     */

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skipped = (page - 1) * limit;
    query = query.skip(skipped).limit(limit);

    // Fetch all posts in desired way from the database
    const posts = await query.select("-__v").populate("author");

    if (posts.length == 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res
      .status(200)
      .json({ message: "Post fetched sucessfully", data: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete post >
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId, {
      new: true,
    });
    if (!deletedPost) {
      return res.status(400).json({
        status: "failed",
        message: "no post found!",
      });
    }
    return res.status(204).json({
      status: "success",
    });
  } catch (error) {
    console.log("error occured", error);
    return res.status(500).json({ message: "internal server error", error });
  }
};
//upvote Post
exports.upVote = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    //1 check if user already upvoted
    let post = await Post.findById(postId);
    if (!post || !userId) {
      return res.status(400).json({
        status: "failed",
        message: !userId ? "userId is not provided" : "no post found",
      });
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
      status: "success",
      votes: post.votes,
    });
  } catch (error) {
    console.error("Error in upvote function:", error);
    return res.status(400).json({
      status: "failed",
      message: error.mesage,
    });
  }
};

//Downvote

exports.downVote = async (req, res) => {
  try {
    try {
      const postId = req.params.postId;
      const userId = req.user._id;
      //1 check if user already upvoted
      let post = await Post.findById(postId);
      if (!post || !userId) {
        return res.status(400).json({
          status: "failed",
          message: !userId ? "userId is not provided" : "no post found",
        });
      }
      //2 remove from upVotes if presen
      post.upVotes = post.upVotes.filter(
        (uid) => uid.toString() !== userId.toString()
      );

      //3 add to downVote is not Present
      if (!post.downVotes.some((uid) => uid == userId) && post.votes > 0) {
        post.votes -= 1;
        post.downVotes.push(userId);
      }

      await post.save();

      return res.status(200).json({
        status: "success",
        votes: post.votes,
      });
    } catch (error) {
      console.error("Error in upvote function:", error);
      return res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  } catch (error) {
    console.error("Error in downvote function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getVotes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(400).json({
        status: "failed",
        message: "no post found",
      });
    }

    return res.status(200).json({
      status: "success",
      votes: post.votes,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.mesage,
      errror,
    });
  }
};

//createcommet
exports.createComment = async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      author: req.user._id,
      post: req.params.postId,
    });

    return res.status(201).json({
      status: "success",
      data: newComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: error.message,
      error,
    });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId,
      { new: true }
    );
    if (!deletedComment) {
      return res.status(400).json({
        status: "failed",
        message: "no doc found!",
      });
    }
    return res.status(204).json({
      status: "success",
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.message,
      error,
    });
  }
};
exports.getAllPostComment = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate(
      "author"
    );

    return res.status(200).json({
      status: "success",
      comments,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.mesage,
      error,
    });
  }
};

exports.getTopUpvotedPosts = async (req, res) => {
  try {
    // Fetch all posts and sort by Upvote count (length of Upvote array) in descending order
    const topPosts = await Post.find()
      .sort({ upVotes: -1 }) // Sorts based on the number of upvotes
      .limit(5); // Retrieves the top 5 posts

    if (topPosts.length == 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json({
      status: "success",
      data: topPosts,
    });
  } catch (error) {
    console.error("Error fetching top upvoted posts:", error);
    return res.status(400).json({
      status: "failed",
      message: error.message,
      error,
    });
  }
};

//TODO implement search post
exports.searchPosts = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * parseInt(limit);

    if (!query) return res.status(400).json({ message: "Query is required" });

    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);
    let searchMethod = "full-text";
    let posts = [];

    // First determine likely category from query
    const detectedCategory = detectCategory(queryLower);

    // Step 1: Full-Text Search in detected category (if any)
    const searchConditions = detectedCategory
      ? { $text: { $search: query }, Category: detectedCategory }
      : { $text: { $search: query } };

    posts = await Post.find(searchConditions, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Step 2: Targeted Title Match in detected category
    if (posts.length === 0 && detectedCategory) {
      searchMethod = "title-match";
      const titleRegex = new RegExp(queryWords.join("|"), "i");
      posts = await Post.find({
        Title: titleRegex,
        Category: detectedCategory,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    // Step 3: Verify results are actually relevant
    if (posts.length > 0) {
      const relevantPosts = posts.filter((post) => {
        const content = [
          post.Title || "",
          post.Description || "",
          post.Solution || "",
        ]
          .join(" ")
          .toLowerCase();

        // At least one query word must appear in the content
        return queryWords.some((word) => content.includes(word));
      });

      if (relevantPosts.length > 0) {
        return res.status(200).json({
          message: `Search results (${searchMethod})`,
          searchMethod,
          posts: relevantPosts.slice(0, parseInt(limit)),
        });
      }
    }

    // If no relevant results found
    return res.status(404).json({
      message: "No matching posts found",
      suggestion: "Try different search terms or check if the topic exists",
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Helper function to detect category from query
function detectCategory(queryLower) {
  if (
    queryLower.includes("hr") ||
    queryLower.includes("human resource") ||
    queryLower.includes("policy")
  ) {
    return "HR";
  }
  if (
    queryLower.includes("canteen") ||
    queryLower.includes("food") ||
    queryLower.includes("meal")
  ) {
    return "Canteen";
  }
  if (
    queryLower.includes("database") ||
    queryLower.includes("api") ||
    queryLower.includes("server")
  ) {
    return "Database";
  }
  return null;
}
exports.filterPostsByDepartment = async (req, res) => {
  try {
    const { department, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }

    const posts = await Post.find({ Department: department })
      .skip(skip)
      .limit(parseInt(limit));

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found for this department" });
    }

    res.status(200).json({ message: "Filtered posts", posts });
  } catch (error) {
    console.error("Error filtering posts:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
