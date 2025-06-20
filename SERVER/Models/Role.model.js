const mongoose = require("mongoose");

const RolesSchema = new mongoose.Schema({
  Role: { type: String, require: true, unique: true },
  RoleId: { type: Number, require: true, unique: true },
});

const Roles = mongoose.model("Roles", RolesSchema);

module.exports = Roles;
