const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routers/userRouter");
const authRoutes = require("./routers/authRouter");
const PostRoutes = require("./routers/postRouter");
const solutionRoutes = require("./routers/solutionRouter");
const departmentRoutes = require("./routers/departmentRouter");
const moderatorRoutes  = require("./routers/moderatorRouter");

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow only frontend requests

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/solution", solutionRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/moderator", moderatorRoutes); //TODO 30

app.use("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: "Welcome to knowledge base",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    message: "page not found!",
  });
});

app.use((err, req, res, next) => {
  console.log(err)
  const code = err.code || 500;
  const message = err.message || "internal server error";
  return res.status(code).json({
    status: "failed",
    message,
    error: err,
  });
});

module.exports = app;
