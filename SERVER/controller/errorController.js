const errorHandler = (err, req, res, next) => {
  let code = err.code || 500;
  let message = err.message || "Internal Server Error!";

  if (err.name === "JsonWebTokenError") {
    message = "Not Logged In!";
    code = 401;
  }

  const response = {
    status: "failed",
    message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    response.error = err;
  }

  return res.status(code).json(response);
};

module.exports = errorHandler;
