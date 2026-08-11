import { NextRequest, NextResponse } from "next/server";

function decodeRole(token: string): "USER" | "ADMIN" | undefined {
  try {
    const part = token.split(".")[1];
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");
    const payload = JSON.parse(decodeURIComponent(escape(atob(padded))));
    return payload.role;
  } catch {
    return undefined;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("flavora_token")?.value;
  const role = token ? decodeRole(token) : undefined;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
