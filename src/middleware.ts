// src/middleware.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const PROTECTED_ROUTES = ["/", "/notes"];
const AUTH_COOKIE_NAME = "personal-hub-auth";

export function middleware(request: NextRequest) {
	const {pathname} = request.nextUrl;
	const cookie = request.cookies.get(AUTH_COOKIE_NAME);

	// Nếu đã đăng nhập và đang ở trang /login, chuyển về trang chủ
	if (cookie && pathname === "/login") {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Nếu chưa đăng nhập VÀ trang đang truy cập KHÔNG PHẢI là /login VÀ nó là một trang được bảo vệ
	if (!cookie && pathname !== "/login" && PROTECTED_ROUTES.some((p) => pathname.startsWith(p))) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

// Giữ nguyên config matcher
export const config = {
	matcher: ["/", "/login", "/notes/:path*"],
};
