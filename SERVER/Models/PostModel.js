const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Solution: { type: String, required: true },
    Upvote: [{ userId: String, userName: String }], // Store userId and userName
    DownVote: [{ userId: String, userName: String }],
    Category: { type: String, require: true },
    Status: { type: Number, require: true },
    author: { type: String, require: true },
    authorId: { type: String, require: true },
    Posthistory: [
      { Solution: { type: String, required: true }, createdAt: { type: Date } },
    ],
    HashTags: [{ type: String }],
    Department: { type: String, require: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
