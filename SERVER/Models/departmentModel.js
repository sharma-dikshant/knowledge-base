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
    active: {
      type: Boolean,
      default: true,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

function filterOnlyActive(next) {
  this.where({ active: true });
  next();
}

departmentSchema.pre(/^find/, filterOnlyActive);
departmentSchema.pre(/^findOneAnd/, filterOnlyActive);

departmentSchema.query.includeInactive = function () {
  return this.where({});
};

departmentSchema.methods.softDelete = function () {
  this.active = false;
  this.deletedAt = new Date();
  return this.save();
};

// preventing hard delete
departmentSchema.pre("deleteOne", { query: true }, async function (next) {
  await this.updateOne({}, { active: false, deletedAt: new Date() });
  next();
});

departmentSchema.pre("deleteMany", async function (next) {
  await this.updateMany({}, { active: false, deletedAt: new Date() });
  next();
});

departmentSchema.pre("findOneAndDelete", async function (next) {
  await this.updateOne({}, { active: false, deletedAt: new Date() });
  next();
});

const departmentModel = mongoose.model("Department", departmentSchema);
module.exports = departmentModel;
