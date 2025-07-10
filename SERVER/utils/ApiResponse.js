class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  send(res) {
    const statusCodeStr = this.statusCode.toString();
    const status =
      statusCodeStr.startsWith("4") || statusCodeStr.startsWith("5")
        ? "failed"
        : "success";
    return res.status(this.statusCode).json({
      status,
      message: this.message,
      data: this.data,
    });
  }
}

module.exports = ApiResponse;
