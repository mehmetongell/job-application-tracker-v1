import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const router = Router(); 

/* ================= REGISTER (Kayıt Ol) ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Gelen veriyi loglayalım ki emin olalım
    console.log("===> Kayıt isteği geldi:", { name, email });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Bu e-posta zaten kullanımda." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Kayıt başarılı",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Kayıt sırasında sunucu hatası." });
  }
});

/* ================= LOGIN (Giriş Yap) ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("===> Giriş denemesi yapılıyor:", email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Hatalı e-posta veya şifre." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Hatalı e-posta veya şifre." });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Giriş başarılı",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Giriş sırasında sunucu hatası." });
  }
});

export default router;