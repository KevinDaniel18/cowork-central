import { SignJWT } from "jose";

export async function generateToken(user: {
  id: number;
  email: string;
  role: string;
}) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(secret);

  return token;
}
