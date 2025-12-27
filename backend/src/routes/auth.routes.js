import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import validate from "../middlewares/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation.js";

const router = Router(); 

/* ================= REGISTER (Kayıt Ol) ================= */
router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
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
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ================= LOGIN (Giriş Yap) ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("1. İstek geldi:", email);

    // Veritabanı sorgusu başlamadan önce
    console.log("2. Prisma sorgusu başlıyor...");
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log("3. Prisma sorgusu bitti, sonuç:", user ? "Kullanıcı bulundu" : "Kullanıcı yok");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials (User not found)" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials (Password mismatch)" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;