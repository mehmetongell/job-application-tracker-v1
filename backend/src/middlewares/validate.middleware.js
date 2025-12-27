import AppError from "../utils/AppError.js";

const validate = (schema) => {
  return (req, res, next) => {
    // Veriyi schema'nın beklediği formatta (body, params, query) sarmalıyoruz
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      // Hataları kullanıcı dostu bir metne çeviriyoruz
      const messages = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      return next(new AppError(messages.join(", "), 400));
    }

    // KRİTİK DÜZELTME: 
    // Schema doğrulamadan sonra veriyi 'body' içine koyduysa, req.body'yi buna eşitle.
    // Böylece controller içinde req.body.email şeklinde erişebilirsin.
    req.body = result.data.body || result.data;
    
    if (result.data.params) {
      Object.assign(req.params, result.data.params);
    }

    next();
  };
};

export default validate;