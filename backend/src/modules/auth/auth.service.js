import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";
import AppError from "../../utils/AppError.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || "7d" 
  });
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new AppError("Email already in use", 400);

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = generateToken(user.id);
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  const token = generateToken(user.id);
  return { 
    token, 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      title: user.title,
      bio: user.bio
    } 
  };
};