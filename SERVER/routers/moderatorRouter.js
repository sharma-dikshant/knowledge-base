const express = require("express");
const postController = require("./../controller/postController");
//TODO 30
const router = express.Router();

router.get("/all", postController.getAllPendingPosts);

module.exports = router;
