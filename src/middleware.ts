// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/login", "/register", "/"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  const url = req.nextUrl.clone();

  // Allow access to public routes
  if (PUBLIC_ROUTES.includes(url.pathname)) {
    return NextResponse.next();
  }

  // Protect /dashboard/* routes
  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      const jwtSecret = new TextEncoder().encode(
        process.env.ACCESS_TOKEN_SECRET,
      );
      await jwtVerify(token, jwtSecret);
      return NextResponse.next();
    } catch (err) {
      console.error("JWT Error:", err);
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
