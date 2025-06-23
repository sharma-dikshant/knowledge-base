const mongoose = require("mongoose");

const solutionSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "solution must belongs to a post!"],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "solution must have author"],
    },
    description: {
      type: String,
      required: [true, "solution must have description"],
    },
  },
  { timestamps: true }
);

const Solution = mongoose.model("Solution", solutionSchema);

module.exports = Solution;
