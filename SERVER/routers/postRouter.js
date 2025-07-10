const express = require("express");
const postController    = require("../controller/postController");
const commentController = require("../controller/commentController");
const authMiddleware = require("../Middleware/AuthMiddleware");
const authController = require("./../controller/authController");

const router = express.Router();

router.use(authController.protected);
router.get("/details/:postId", postController.getPostDetails);
router.get("/getTopfivePosts", postController.getTopUpvotedPosts);
router.get("/all", postController.getAllPosts);
router.get("/users/:authorId", postController.getPostbyAuthor);
router.get("/votes/:postId", postController.getVotes);
router.get("/comments/:postId/all", commentController.getAllPostComment);
router.get("/search", postController.searchPosts);

router.post("/", postController.createPost);
router.patch("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

router.post("/votes/up/:postId", postController.upVote);
router.post("/votes/down/:postId", postController.downVote);

router.post("/comments/:postId", commentController.createComment);
router.delete("/comments/:commentId", commentController.deleteComment);

router.use(authController.restrictTo("admin", "moderator"));
router.post("/approve/:postId", postController.approvePost);
router.post("/reject/:postId", postController.rejectPost);

module.exports = router;
