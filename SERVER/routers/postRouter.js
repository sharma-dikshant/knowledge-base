const express = require("express");
const postController = require("../controller/postController");
const authMiddleware = require("../Middleware/AuthMiddleware");

const router = express.Router();

router.post("/createPost", postController.createPost);
router.patch("/updatePost/:postId", postController.updatePost);
router.delete("/deletePost/:postId", postController.deletePost);
router.get("/getPosts", postController.getAllPosts);
router.get("/getUserPost/:authorId", postController.getPostbyAuthor);
router.get("/getTopfivePosts", postController.getTopUpvotedPosts);

router.post("/upVote/:postId", postController.upVote);
router.post("/downVote/:postId", postController.downVote);
router.get("/getVotes/:postId", postController.getVotes);

router.post("/comment/:postId", postController.createComment);
router.delete("/comment/:commentId", postController.deleteComment);
router.get("/getAllComment/:postId", postController.getAllPostComment);

router.get("/search", postController.searchPosts);
router.get("/filterByDepartment", postController.filterPostsByDepartment);

module.exports = router;
