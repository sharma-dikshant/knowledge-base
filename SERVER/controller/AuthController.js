const User = require("../Models/User.model");
const bcrypt = require("bcryptjs");
const Token = require("../Models/Token");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const { generateCaptcha } = require("../Captcha/Captcha");

const getCaptcha = (req, res) => {
  const captcha = generateCaptcha();
  req.session.captcha = captcha.text.toUpperCase(); // Store CAPTCHA in session
  res.json({ image: captcha.image });
};

const Login = async (req, res) => {
  try {
    const { EmployeeCode, Password, captchaInput } = req.body;
    console.log(req.body);
    if (!EmployeeCode || !Password) {
      return res.status(400).json({ message: "all fields required" });
    }
    const user = await User.findOne({ EmployeeCode: EmployeeCode }).lean();

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    console.log("userfind successfully", user);

    const isPasswordCorrect = await bcrypt.compare(Password, user.Password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Inconrrect Password" });
    }
    console.log("password is comapred successfully");
    const existingToken = await Token.findOne({ userId: user._id });
    if (existingToken) {
      return res.status(403).json({ message: "User is already logged in" });
    }
    delete user.Password;
    console.log(req.session.captcha);
    if (!captchaInput || req.session.captcha !== captchaInput.toUpperCase()) {
      return res.status(400).json({ message: "CAPTCHA verification failed" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.secretKey, {
      expiresIn: "1d",
    });
    await new Token({ userId: user._id, token }).save();
    const encryptedUserData = CryptoJS.AES.encrypt(
      JSON.stringify(user),
      process.env.secretKey
    ).toString();
    res.cookie("authToken", token, {
      httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    res.json({
      Message: "login sucessfully",
      Token: token,
      Data: encryptedUserData,
    });
    console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { Login, getCaptcha };
