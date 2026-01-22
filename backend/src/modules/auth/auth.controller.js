import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js"; 
import prisma from "../../prisma/client.js"; 

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    status: "success",
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    status: "success",
    data: result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, title: true, bio: true } 
  });
  
  res.status(200).json({ status: "success", data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, title, bio } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, title, bio },
    select: { id: true, name: true, email: true, title: true, bio: true }
  });

  res.status(200).json({ status: "success", data: updatedUser });
});