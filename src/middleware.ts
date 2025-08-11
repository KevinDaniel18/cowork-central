import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/verifyToken";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/dashboard", "/booking", "/spaces"];

  // Rutas que requieren admin
  const adminRoutes = ["/admin"];

  // Rutas de auth (redirigir si ya está logueado)
  const authRoutes = ["/auth/login", "/auth/register"];

  const token = request.cookies.get("auth-token")?.value;

  let user = null;

  if (token) {
    try {
      user = await verifyToken(token);
    } catch (error: any) {
      console.error("Error verificando token", error?.code || error);

      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/dashboard?error=access-denied", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/booking/:path*",
    "/spaces/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
