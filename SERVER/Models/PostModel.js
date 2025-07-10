const mongoose = require("mongoose");

const postStatusCodes = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
};

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
      type: Number,
      required: [true, "post must have valid status"],
      enum: [
        postStatusCodes.PENDING,
        postStatusCodes.APPROVED,
        postStatusCodes.REJECTED,
      ], // pending approved cancelled
      default: postStatusCodes.PENDING, //pending
    },
    statusChangedBy: {
      user: { type: mongoose.Schema.ObjectId, ref: "User" },
      action: {
        type: Number,
        enum: [postStatusCodes.APPROVED, postStatusCodes.REJECTED],
      },
      at: { type: Date },
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
    active: {
      type: Boolean,
      default: true,
    },
    deletedAt: Date,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

function filterOnlyActive(next) {
  if (this.inActiveFlag) return next();
  this.where({ active: true });
  next();
}

postSchema.pre(/^find/, filterOnlyActive); // covers find, findOne, findById, etc.
postSchema.pre(/^findOneAnd/, filterOnlyActive); // findOneAndUpdate, findOneAndDelete

postSchema.query.onlyInActive = function () {
  this.inActiveFlag = true;
  return this.where({ active: false });
};

postSchema.methods.softDelete = function () {
  this.active = false;
  this.deletedAt = new Date();
  return this.save();
};

// preventing hard delete
postSchema.pre("deleteOne", { query: true }, async function (next) {
  await this.updateOne({}, { active: false, deletedAt: new Date() });
  next();
});

postSchema.pre("deleteMany", async function (next) {
  await this.updateMany({}, { active: false, deletedAt: new Date() });
  next();
});

postSchema.pre("findOneAndDelete", async function (next) {
  await this.updateOne({}, { active: false, deletedAt: new Date() });
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
