const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "role must have name"],
  },
  permissions: [
    {
      type: String,
      default: "read",
      enum: ["read", "write", "admin", "moderator"],
    },
  ],
});

const roleModel = mongoose.model("Role", roleSchema);
module.exports = roleSchema;
