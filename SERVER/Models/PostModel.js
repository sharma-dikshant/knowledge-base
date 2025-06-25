const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "post must have title"],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "post must have description"],
    },
    votes: { type: Number, default: 0 },
    upVotes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    downVotes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    category: {
      type: String,
      required: [true, "category is required to post"],
      lowercase: true,
    },
    status: {
      //* pending, reviewed, verified
      type: String,
      required: [true, "post must have valid status"],
      enum: ["pending", "reviewed", "verified"],
      default: "pending",
    },
    private: {
      type: Boolean,
      default: true,
      required: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "post must have author"],
    },

    hashtags: [{ type: String, lowercase: true }],
    department: {
      type: String,
      required: [true, "post must belong to a department"],
      lowercase: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


const Post = mongoose.model("Post", postSchema);
module.exports = Post;

