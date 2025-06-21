const User = require("./../models/userModel");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const { generateCaptcha } = require("../Captcha/Captcha");

exports.getCaptcha = (req, res) => {
  const captcha = generateCaptcha();
  req.session.captcha = captcha.text.toUpperCase(); // Store CAPTCHA in session
  res.json({ image: captcha.image });
};

function generateToken(payload) {
  const token = jwt.sign(payload, process.env.secretKey, {
    expiresIn: "90d",
  });
  return token;
}

exports.login = async (req, res) => {
  try {
    const { employeeId, password, captchaInput } = req.body;
    if (!employeeId || !password) {
      return res.status(400).json({ message: "all fields required" });
    }
    const user = await User.findOne({ employeeId: employeeId }).lean(); // lean method just return simple js object not Doc

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with given employeeId" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    //TODO captcha verification

    const token = generateToken({
      _id: user._id,
      employeeId: user.employeeId,
    });

    res.cookie("authToken", token, {
      httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 day expiration
    });

    res.json({
      message: "login sucessfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: `Login failed ${error.message}`,
      error,
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    const token = generateToken({
      userId: newUser._id,
      employeeId: newUser.employeeId,
    });
    res.cookie("authToken", token, {
      httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 day expiration
    });
    return res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.message,
      error,
    });
  }
};

exports.logout = async (req, res) => {
  res.cookie("authToken", "invalid", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 90 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    message: "logout successfully",
  });
};

exports.protected = async (req, res, next) => {
  //1. get token either from header or cookies
  try {
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.authToken) {
      token = req.cookies.authToken;
    }
    //2. Verify token
    if (!token) {
      return res.status(400).json({
        status: "failed",
        message: "You're logged out! Please login again to continue",
      });
    }
    let decoded = {};
    try {
      decoded = await promisify(jwt.verify)(token, process.env.secretKey);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "failed",
        message: `error in authorization! ${error.message}`,
        error,
      });
    }
    //3. Check if user exists
    const currentUser = await User.findById(decoded._id);
    if (!currentUser) {
      return res.status(400).json({
        status: "failed",
        message: "user belonging to this token does no longer exist",
      });
    }
    //4. Append user to req object
    req.user = currentUser;
    //5. Grant access
    next();
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: `error in authorization! ${error.message}`,
      error,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "failed",
        message: "you're not allowed to access this service",
      });
    }
    //permission granted
    next();
  };
};
