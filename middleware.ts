import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    // Rule 1: Admin Area sirf Admin ke liye
    if (path.startsWith("/dashboard") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Rule 2: Seller Area sirf Seller ke liye
    if (path.startsWith("/seller") && role !== "SELLER") {
      return NextResponse.redirect(new URL("/", req.url)); // Ya login pe bhej do
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Login hona zaroori hai
    },
  }
);

// Kin routes par ye rule chalega?
export const config = {
  matcher: ["/dashboard/:path*", "/seller/:path*"], 
};