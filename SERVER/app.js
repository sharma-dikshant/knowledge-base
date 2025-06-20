const express = require("express");
const userRoutes = require("./routers/userRouter");
const authRoutes = require("./routers/authRouter");
const PostRoutes = require("./routers/postRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Allow only frontend requests

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", PostRoutes);

app.use("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: "Welcome to knowledge base",
  });
});

module.exports = app;
