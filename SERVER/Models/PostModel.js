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
    category: { type: String, required: true, lowercase: true },
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

    hashtags: [{ type: String, lowercase: true }],
    department: { type: String, required: true, lowercase: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// setting virtual properties for upVoteCount and downVoteCount
// postSchema.virtual("upVoteCount").get(function () {
//   return this.upVotes?.length || 0;
// });
// postSchema.virtual("downVoteCount").get(function () {
//   return this.downVotes?.length || 0;
// });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

//TODO post history is still not implemented
// postHistory: [
//   {
//     solutions: { type: String, required: true },
//     createdAt: { type: Date },
//   },
// ],
