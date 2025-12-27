import AppError from "../utils/appError.js";

const validate = (schema) => {
  return (req, res, next) => {
    // Şemayı kontrol etmek için verileri topluyoruz
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      // Hata mesajlarını düzenle
      const messages = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );

      return next(new AppError(messages.join(", "), 400));
    }

    // ✅ Sadece body ve params üzerine yazıyoruz (query genellikle gerekmez veya salt okunurdur)
    // Zod'dan geçen temizlenmiş veriyi atıyoruz
    req.body = result.data.body;
    
    // params objesini tek tek güncellemek daha güvenlidir
    if (result.data.params) {
      Object.assign(req.params, result.data.params);
    }

    next();
  };
};

export default validate;