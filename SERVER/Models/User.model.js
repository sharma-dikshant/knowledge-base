const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true },
    EmployeeCode: { type: Number, required: true, unique: true },
    Password: { type: String, required: true },
    Role: [{ type: String, require: true, default: ["user"] }],
    RoleId: [{ type: Number, require: true, default: [1] }],
    Email: { type: String, required: false },
    Grade: { type: String, required: true },
    Department: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
