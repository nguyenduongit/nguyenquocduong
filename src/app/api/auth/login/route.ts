// src/app/api/auth/login/route.ts
import {NextResponse} from "next/server";
import {cookies} from "next/headers"; // Vẫn cần để đọc cookie nếu cần, nhưng không bắt buộc cho việc set

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
			// Mật khẩu đúng, tạo response và set cookie trên đó
			const response = NextResponse.json({message: "Đăng nhập thành công."}, {status: 200});

			response.cookies.set(AUTH_COOKIE_NAME, "true", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: 60 * 60 * 24 * 30, // 30 ngày
			});

			return response; // Trả về response đã được set cookie
		} else {
			// Mật khẩu sai
			return NextResponse.json({message: "Mật khẩu không chính xác."}, {status: 401});
		}
	} catch (error) {
		console.error(error); // Log lỗi ra để debug
		return NextResponse.json({message: "Đã có lỗi xảy ra."}, {status: 500});
	}
}
