const express = require("express");
const postController    = require("../controller/postController");
const commentController = require("../controller/commentController");
const authMiddleware = require("../Middleware/AuthMiddleware");
const authController = require("./../controller/authController");

const router = express.Router();

router.use(authController.optionalAuth);
router.get("/details/:postId", postController.getPostDetails);
router.get("/getTopfivePosts", postController.getTopUpvotedPosts);
router.get("/getPosts", postController.getAllPosts);
router.get("/getUserPost/:authorId", postController.getPostbyAuthor);
router.get("/getVotes/:postId", postController.getVotes);
router.get("/getAllComment/:postId", commentController.getAllPostComment);
router.get("/search", postController.searchPosts);

router.use(authController.protected);
router.post("/createPost", postController.createPost);
router.patch("/updatePost/:postId", postController.updatePost);
router.delete("/deletePost/:postId", postController.deletePost);

router.post("/upVote/:postId", postController.upVote);
router.post("/downVote/:postId", postController.downVote);

router.post("/comment/:postId", commentController.createComment);
router.delete("/comment/:commentId", commentController.deleteComment);

router.use(authController.restrictTo("admin", "moderator"));
router.post("/approve-post/:postId", postController.approvePost);
router.post("/reject-post/:postId", postController.rejectPost);

module.exports = router;
