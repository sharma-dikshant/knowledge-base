const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "department must have name"],
      lowercase: true,
    },
    departmantId: {
      type: String,
      require: [true, "department must have Id"],
      lowercase: true,
    },
  },
  { timestamps: true }
);

const departmentModel = mongoose.model("Department", departmentSchema);
module.exports = departmentModel;
