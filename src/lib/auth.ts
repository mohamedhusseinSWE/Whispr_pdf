// lib/auth.ts
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { cookies } from "next/headers";

export async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const jwt_secret = process.env.ACCESS_TOKEN_SECRET;
    const payload = jwt.verify(token, jwt_secret!) as { sub: string };

    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return user;
  } catch (err) {
    console.error("Invalid JWT:", err);
    return null;
  }
}
