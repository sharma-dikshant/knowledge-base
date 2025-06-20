const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "post must have title"] },
    description: {
      type: String,
      required: [true, "post must have description"],
    },
    upVotes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    downVotes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    category: { type: String, required: true },
    status: {
      //* pending, reviewed, verified
      type: String,
      required: [true, "post must have valid status"],
      enum: ["pending", "reviewed", "verified"],
      default: "pending",
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "post must have author"],
    },

    hashtags: [{ type: String }],
    department: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

//TODO post history is still not implemented
// postHistory: [
//   {
//     solutions: { type: String, required: true },
//     createdAt: { type: Date },
//   },
// ],
