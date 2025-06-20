const Post = require("../models/postModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const Comment = require("../models/commentModel");
// const natural = require("natural");
// const stemmer = natural.PorterStemmer;

// const stringSimilarity = require("string-similarity");

//create post
const createPost = async (req, res) => {
  try {
    const {
      Title,
      Description,
      solution,
      category,
      status,
      employeeCode,
      HashTags,
      Department,
    } = req.body;

    if (
      !Title ||
      !Description ||
      !solution ||
      !category ||
      !status ||
      !employeeCode ||
      !Department
    ) {
      return res.status(400).json({ message: "all fields required" });
    }

    const user = await User.findOne({ EmployeeCode: employeeCode });
    if (!user) {
      return res.status(404).json({ message: "user no found" });
    }
    const newPost = new Post({
      Title: Title,
      Description: Description,
      Solution: solution,
      Upvote: [],
      DownVote: [],
      Category: category,
      Status: status,
      author: user.Username,
      authorId: user._id,
      Posthistory: [],
      HashTags: HashTags || [],
      Department: Department,
    });

    await newPost.save();

    return res.status(201).json({ message: "post create sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

//update post

const updatePost = async (req, res) => {
  try {
    const { employeeCode, PostId, Solution, ...data } = req.body;

    if (!employeeCode || !PostId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ EmployeeCode: employeeCode });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(PostId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Debugging: Log values before updating
    // console.log("Old Solution:", post.Solution);
    // console.log("New Solution:", Solution);

    // Ensure Posthistory exists as an array
    if (!Array.isArray(post.Posthistory)) {
      post.Posthistory = [];
    }

    // If solution is being updated, store the old solution in history
    if (Solution && post.Solution !== Solution) {
      post.Posthistory.push({
        Solution: post.Solution,
        createdAt: post.updatedAt || post.createdAt,
      });

      post.markModified("Posthistory");
      // Ensure Posthistory is marked as modified
      post.Solution = Solution;
    }
    console.log(post.Posthistory);
    // Update other fields
    Object.assign(post, data);
    post.updatedAt = new Date();

    // Save the updated post and log errors if any
    try {
      await post.save();
    } catch (saveError) {
      console.error("Error saving post:", saveError);
      return res
        .status(500)
        .json({ message: "Error saving post", error: saveError });
    }

    return res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getPost = async (req, res) => {
  try {
    const { authorId } = req.params;
    if (!authorId) {
      return res.status(400).json({ message: "authorId required" });
    }

    const Posts = await Post.find({ authorId: authorId });

    if (!Posts) {
      return res.status(404).json({ mesage: "no posts found" });
    }

    return res
      .status(201)
      .json({ message: "posts fetched successfully", data: Posts });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts from the database

    if (!posts || posts.length === 0) {
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
const deletePost = async (req, res) => {
  try {
    const { PostId } = req.params;

    const post = await Post.findById({ _id: PostId });

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const user = await User.findById(post.authorId);
    if (
      user._id === post.authorId ||
      user.RoleId.includes(1) ||
      user.RoleId.includes(3)
    ) {
      await Post.findByIdAndDelete({ _id: PostId });
      return res.status(201).json({ message: "post deleted sucessfully" });
    } else {
      return res.status(404).json({ message: "unauthorised user" });
    }
  } catch (error) {
    console.log("error occured", error);
    return res.status(500).json({ message: "internal server error", error });
  }
};
//upvote Post
const upvote = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    // Validate input
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "postId and userId are required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if user already downvoted
    if (post.Upvote.some((id) => id.equals(userObjectId))) {
      return res.status(200).json({ message: "Already downvoted" });
    }

    // Remove user from Upvote if exists
    if (post.DownVote.some((id) => id.equals(userObjectId))) {
      console.log("User in upvote, removing...");
      post.DownVote = post.DownVote.filter((id) => !id.equals(userObjectId));
    }

    // Add user to DownVote
    post.Upvote.push(userObjectId);
    await post.save();

    return res.status(201).json({ message: "Vote added successfully" });
  } catch (error) {
    console.error("Error in upvote function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//DownPost

const Downvote = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    // Validate input
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "postId and userId are required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if user already downvoted
    if (post.DownVote.some((id) => id.equals(userObjectId))) {
      return res.status(200).json({ message: "Already downvoted" });
    }

    // Remove user from Upvote if exists
    if (post.Upvote.some((id) => id.equals(userObjectId))) {
      console.log("User in upvote, removing...");
      post.Upvote = post.Upvote.filter((id) => !id.equals(userObjectId));
    }

    // Add user to DownVote
    post.DownVote.push(userObjectId);
    await post.save();
    console.log(post);

    return res.status(201).json({ message: "Downvote added successfully" });
  } catch (error) {
    console.error("Error in downvote function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//createcommet
const createComment = async (req, res) => {
  try {
    const { userId, PostId, Content } = req.body;
    if (!userId || !PostId || !Content) {
      return res.status(400).json({ message: "all parameter required" });
    }

    const newComment = new Comment({
      authorId: userId,
      postId: PostId,
      comment: Content,
    });

    const savedComment = await newComment.save();
    res.status(201).json({ message: "comment saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error", error });
  }
};
const DeleteComment = async (req, res) => {
  try {
    const { CommentId } = req.params;
    if (!CommentId) {
      return res.status(400).json({ message: "commentId Required" });
    }
    console.log("comment id retrieved");
    const Commentdata = await Comment.findById(CommentId);
    if (!Commentdata) {
      return res.status(404).json({ message: "no such comment" });
    }
    console.log("comment is retrieved");
    const user = await User.findById({ _id: Commentdata.authorId });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    console.log("user retrieved");
    if (
      user._id === Commentdata.authorId ||
      user.RoleId.includes(1) ||
      user.RoleId.includes(3)
    ) {
      await Comment.findByIdAndDelete(CommentId);
      return res.status(201).json({ message: "commnet deleted sucessfully" });
    } else {
      return res.status(400).json({ message: "you are not authorised" });
    }
  } catch (error) {}
};
const getAllPostComment = async (req, res) => {
  try {
    const { postId } = req.query; // Use camelCase

    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }

    const postComments = await Comment.find({ postId });

    if (postComments.length === 0) {
      return res.status(200).json({ message: "No comments found", data: [] });
    }

    return res
      .status(200)
      .json({ message: "Comments fetched successfully", data: postComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getTopUpvotedPosts = async (req, res) => {
  try {
    // Fetch all posts and sort by Upvote count (length of Upvote array) in descending order
    const topPosts = await Post.find()
      .sort({ Upvote: -1 }) // Sorts based on the number of upvotes
      .limit(5); // Retrieves the top 5 posts

    if (!topPosts || topPosts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    console.log(topPosts);
    return res.status(200).json({ topPosts });
  } catch (error) {
    console.error("Error fetching top upvoted posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const searchPosts = async (req, res) => {
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
const filterPostsByDepartment = async (req, res) => {
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

module.exports = {
  createPost,
  filterPostsByDepartment,
  createComment,
  getAllPostComment,
  updatePost,
  deletePost,
  searchPosts,
  upvote,
  getTopUpvotedPosts,
  Downvote,
  DeleteComment,
  getAllPosts,
  getPost,
};
