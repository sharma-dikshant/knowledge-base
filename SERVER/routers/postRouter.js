const express = require("express");
const postController = require("../controller/postController");
const authMiddleware = require("../Middleware/AuthMiddleware");

const router = express.Router();

router.post("/createPost", postController.createPost);
router.post("/updatePost", postController.updatePost);
router.delete("/deletePost/:PostId", postController.deletePost);
router.post("/upVote", postController.upVote);
router.post("/downVote", postController.downVote);
router.get("/getPosts", postController.getAllPosts);
router.get("/getUserPost/:authorId", postController.getPost);
router.get("/getTopfivePosts", postController.getTopUpvotedPosts);

router.post("/createComment", postController.createComment);
router.get("/getAllPostComment", postController.getAllPostComment);
router.delete("/deleteComment/:CommentId", postController.deleteComment);
router.get("/search", postController.searchPosts);
router.get("/filterByDepartment", postController.filterPostsByDepartment);

module.exports = router;
