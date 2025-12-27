import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log("PRISMA MODELS:", Object.keys(prisma));

export default prisma;
