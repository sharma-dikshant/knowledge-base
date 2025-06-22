const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "comment content is required"],
      lowercase: true,
    },

    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "author is required to create solution"],
    },

    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "post is required to create solution"],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
