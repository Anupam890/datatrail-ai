import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/arena", "/lab", "/ranks", "/nexus", "/u"];
const authRoutes = ["/login", "/signup"];

export default function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  if (!sessionCookie && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages to arena (landing)
  if (sessionCookie && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/arena", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/arena/:path*", "/lab/:path*", "/ranks", "/login", "/signup"],
};
