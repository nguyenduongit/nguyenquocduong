import {NextResponse} from "next/server";
import {cookies} from "next/headers"; // Đảm bảo import từ 'next/headers'

const AUTH_COOKIE_NAME = "personal-hub-auth";
const APP_PASSWORD = process.env.APP_PASSWORD;

export async function POST(request: Request) {
	try {
		if (!APP_PASSWORD) {
			console.error("APP_PASSWORD is not set in environment variables.");
			return NextResponse.json({message: "Lỗi cấu hình server."}, {status: 500});
		}

		const {password} = await request.json();

		if (password === APP_PASSWORD) {
			// Mật khẩu đúng, set cookie.
			// Cú pháp này là đúng cho Route Handlers trong App Router.
			cookies().set(AUTH_COOKIE_NAME, "true", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: 60 * 60 * 24 * 30, // 30 ngày
			});
			return NextResponse.json({message: "Đăng nhập thành công."}, {status: 200});
		} else {
			// Mật khẩu sai
			return NextResponse.json({message: "Mật khẩu không chính xác."}, {status: 401});
		}
	} catch (error) {
		console.error(error); // Log lỗi ra để debug
		return NextResponse.json({message: "Đã có lỗi xảy ra."}, {status: 500});
	}
}
