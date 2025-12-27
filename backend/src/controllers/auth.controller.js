import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

export const authMiddleware = async (req, res, next) => {
  console.log("===> GELEN BODY:", req.body);
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
