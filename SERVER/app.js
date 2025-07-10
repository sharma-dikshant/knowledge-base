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
const errorController = require("./controller/errorController");

const app = express();


app.use(morgan("dev"));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://drsnk5lg-5173.inc1.devtunnels.ms",
    ],
    credentials: true,
  })
); // Allow only frontend requests


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/solutions", solutionRoutes);
app.use("/api/departments", departmentRoutes);

app.use("*", (req, res) => {
  res.status(404).json({
    message: "page not found!",
  });
});

app.use(errorController);

module.exports = app;
