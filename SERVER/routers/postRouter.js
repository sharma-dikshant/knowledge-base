const express = require("express");
const postController = require("../controller/postController");
const authMiddleware = require("../Middleware/AuthMiddleware");
const authController = require("./../controller/authController");

const router = express.Router();

router.get("/detail/:postId", postController.getPostDetails);
router.get("/getTopfivePosts", postController.getTopUpvotedPosts);
router.get("/getPosts", postController.getAllPosts);
router.get("/getUserPost/:authorId", postController.getPostbyAuthor);
router.get("/getVotes/:postId", postController.getVotes);
router.get("/getAllComment/:postId", postController.getAllPostComment);
router.get("/search", postController.searchPosts);
router.get("/filterByDepartment", postController.filterPostsByDepartment);

router.use(authController.protected);
router.post("/createPost", postController.createPost);
router.patch("/updatePost/:postId", postController.updatePost);
router.delete("/deletePost/:postId", postController.deletePost);

router.post("/upVote/:postId", postController.upVote);
router.post("/downVote/:postId", postController.downVote);

router.post("/comment/:postId", postController.createComment);
router.delete("/comment/:commentId", postController.deleteComment);

module.exports = router;
