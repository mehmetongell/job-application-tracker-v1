export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV !== "production") {
    console.error("ERROR LOG:", {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors || undefined, 
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};