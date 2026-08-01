const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ===============================
  // Development Logging
  // ===============================
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  // ===============================
  // Invalid MongoDB ObjectId
  // ===============================
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // ===============================
  // Duplicate Key Error
  // ===============================
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 400;
    message = `${field} already exists.`;
  }

  // ===============================
  // Validation Error
  // ===============================
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(". ");
  }

  // ===============================
  // Multer Errors
  // ===============================
  else if (err.name === "MulterError") {
    statusCode = 400;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds the 5MB limit.";
    } else {
      message = err.message;
    }
  }

  // ===============================
  // Custom Upload Errors
  // ===============================
  else if (
    err.message &&
    (
      err.message.includes("Only image") ||
      err.message.includes("Only PDF") ||
      err.message.includes("Only Word")
    )
  ) {
    statusCode = 400;
    message = err.message;
  }

  // ===============================
  // Final Response
  // ===============================
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;