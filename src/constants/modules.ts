import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export const prisma = new PrismaClient();
export { bcrypt, SignJWT };
