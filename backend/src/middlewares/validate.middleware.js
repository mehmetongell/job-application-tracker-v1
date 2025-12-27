import AppError from "../utils/appError.js";

const validate = (schema) => {
  return (req, res, next) => {
    
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      
      const messages = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );

      return next(new AppError(messages.join(", "), 400));
    }

    
    req.body = result.data.body;
    
    
    if (result.data.params) {
      Object.assign(req.params, result.data.params);
    }

    next();
  };
};

export default validate;