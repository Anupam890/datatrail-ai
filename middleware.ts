import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/playground", "/challenges", "/learn", "/progress"];
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  if (!sessionCookie && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (sessionCookie && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/playground/:path*", "/challenges/:path*", "/learn/:path*", "/progress/:path*", "/login", "/signup"],
};
