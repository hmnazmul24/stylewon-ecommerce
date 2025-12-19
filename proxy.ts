import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const AUTH_ROUTES = ["/account", "/checkout"]; // starts with
const ADMIN_ROUTE = "/admin"; // starts with

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!sessionCookie && pathname.startsWith(ADMIN_ROUTE)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  // An array of paths can be provided for multiple matchers
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
