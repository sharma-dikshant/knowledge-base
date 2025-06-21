const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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

// pre -middlewares
userSchema.pre("save", async function (next) {
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  if (this.role !== "user") {
    return next("only 'user' is valid role for signing Up");
  }

  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
