const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "user must have name"] },
    employeeId: {
      type: Number,
      required: [true, "user must have employee Id"],
      unique: true,
    },
    password: { type: String, required: [true, "password is required"] },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      required: true,
      default: "user",
    },
    email: { type: String, required: false },
    grade: { type: String, required: false },
    department: { type: String, required: false }, //TODO if user is admin or moderator then only they should specify department
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
