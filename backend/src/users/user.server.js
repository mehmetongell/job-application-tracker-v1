import prisma from "../prisma/client.js";

export const createUserService = async (data) => {
  return prisma.user.create({
    data,
  });
};
