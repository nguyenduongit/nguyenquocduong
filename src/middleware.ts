// src/middleware.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

// Thêm "/notes" vào danh sách các trang cần bảo vệ
const PROTECTED_ROUTES = ["/", "/notes"];
const AUTH_COOKIE_NAME = "personal-hub-auth";

export function middleware(request: NextRequest) {
	const {pathname} = request.nextUrl;
	const cookie = request.cookies.get(AUTH_COOKIE_NAME);

	if (cookie && pathname === "/login") {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (!cookie && PROTECTED_ROUTES.some((p) => pathname.startsWith(p))) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

// Thêm "/notes/:path*" vào matcher
export const config = {
	matcher: ["/", "/login", "/notes/:path*"],
};
