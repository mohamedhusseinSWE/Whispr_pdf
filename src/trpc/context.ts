import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { inferAsyncReturnType } from "@trpc/server";

export async function createContext() {
  const cookieStore = await cookies(); // no need to `await` cookies()
  const token = cookieStore.get("auth_token")?.value;

  let userId: string | null = null;

  if (token) {
    try {
      const payload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as jwt.JwtPayload;

      if (typeof payload.sub === "string") {
        userId = payload.sub;
      }
    } catch (error) {
      console.error("JWT verification failed:", error);
    }
  }

  return {
    userId,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
