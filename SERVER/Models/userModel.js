const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
};

const USER_STATUS = {
  INACTIVE: -1,
  ACTIVE: 1,
  ALL: 2,
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user must have name"],
      lowercase: true,
    },
    employeeId: {
      type: Number,
      required: [true, "user must have employee Id"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: [USER_ROLES.USER, USER_ROLES.MODERATOR, USER_ROLES.ADMIN],
      required: true,
      default: USER_ROLES.USER,
    },
    email: {
      type: String,
      required: false,
      validate: [validator.isEmail, "Please provide valid email"],
    },
    grade: { type: String, required: false },
    mobile: {
      type: String,
      required: false,
      validate: [validator.isMobilePhone, "Please provide valid mobile number"],
      minLength: [10, "please provide valid mobile number"],
      maxLength: [10, "please provide valid mobile number"],
    },
    department: { type: String, required: true, lowercase: true },
    active: {
      type: Boolean,
      default: true,
    },
    deletedAt: Date,
  },

  { timestamps: true, select: false }
);

// pre -middlewares
userSchema.pre("save", async function (next) {
  if (this.isSoftDeleting) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  if (this.role !== USER_ROLES.USER) {
    return next("only 'user' is valid role for signing Up");
  }

  next();
});

/* Query functions for retriving desired user */
// hide inactive user
userSchema.pre(/^find/, function (next) {
  const filter = this.getFilter();
  if (filter.active && filter.active === USER_STATUS.INACTIVE) {
    this.find({ active: { $ne: true } });
  } else {
    this.find({ active: { $ne: false } });
  }
  next();
});

/* Instance Method */
userSchema.methods.softDelete = function () {
  this.isSoftDeleting = true; // to avoid pre save middleware
  this.active = false;
  this.deletedAt = new Date();
  return this.save();
};

/* preventing accidental hard delete */
userSchema.pre("deleteOne", { query: true }, async function (next) {
  await this.updateOne({}, { active: false, deletedAt: new Date() });
  next();
});

userSchema.pre("deleteMany", async function (next) {
  await this.updateMany({}, { active: false, deletedAt: new Date() });
  next();
});

userSchema.pre("findOneAndDelete", async function (next) {
  await this.updateOne({}, { active: false, deletedAt: new Date() });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
