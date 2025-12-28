import * as authService from "./auth.service.js";

export const register = async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    status: "success",
    data: result,
  });
};

export const login = async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    status: "success",
    data: result,
  });
};