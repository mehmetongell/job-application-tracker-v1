import AppError from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      let message = "Validation failed";
      
      if (result.error && result.error.errors) {
        message = result.error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(" | ");
      } else if (result.error) {
        message = result.error.message;
      }

      console.log("❌ Validation Error Detail:", message);
      return next(new AppError(message, 400));
    }

    req.body = result.data;
    next();
  } catch (error) {
    return next(new AppError(`Validation middleware error: ${error.message}`, 500));
  }
};