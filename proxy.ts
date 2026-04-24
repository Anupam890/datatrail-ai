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
  // We remove this to prevent potential redirect loops if the cookie exists but session is invalid
  // Let the client-side handle this redirect if needed.
  /*
  if (sessionCookie && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/arena", request.url));
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ["/arena", "/arena/:path*", "/lab", "/lab/:path*", "/ranks", "/login", "/signup"],
};
