const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routers/userRouter");
const authRoutes = require("./routers/authRouter");
const PostRoutes = require("./routers/postRouter");

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow only frontend requests

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
