// src/middleware.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const PROTECTED_ROUTES = ["/", "/notes"];
const AUTH_COOKIE_NAME = "personal-hub-auth";

export function middleware(request: NextRequest) {
	const {pathname} = request.nextUrl;
	const cookie = request.cookies.get(AUTH_COOKIE_NAME);
	const isAuthenticated = !!cookie;

	const isAccessingLoginPage = pathname === "/login";
	const isAccessingProtectedRoute = PROTECTED_ROUTES.some((p) => pathname.startsWith(p));

	// Nếu đã đăng nhập và truy cập trang login, chuyển hướng về trang chủ
	if (isAuthenticated && isAccessingLoginPage) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Nếu chưa đăng nhập và đang truy cập một trang cần bảo vệ, chuyển hướng đến trang login
	// Điều kiện isAccessingLoginPage === false để tránh vòng lặp
	if (!isAuthenticated && !isAccessingLoginPage && isAccessingProtectedRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/login", "/notes/:path*"],
};
