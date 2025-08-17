// src/app/api/sites/reorder/route.ts
import {supabase} from "@/lib/supabaseClient";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
	try {
		const {siteIds}: {siteIds: string[]} = await request.json();

		if (!Array.isArray(siteIds) || siteIds.length === 0) {
			return NextResponse.json({error: "An array of siteIds is required"}, {status: 400});
		}

		// Tạo một mảng các promise để cập nhật từng site
		const updatePromises = siteIds.map((id, index) =>
			supabase
				.from("sites")
				.update({position: index}) // Cập nhật cột 'position' với chỉ số mới
				.eq("id", id),
		);

		// Thực thi tất cả các promise
		const results = await Promise.all(updatePromises);

		// Kiểm tra lỗi trong quá trình cập nhật
		const errors = results.filter((res) => res.error);
		if (errors.length > 0) {
			console.error(
				"Supabase errors during reorder:",
				errors.map((e) => e.error?.message),
			);
			// Chỉ lấy lỗi đầu tiên để trả về cho client
			return NextResponse.json({error: errors[0].error?.message}, {status: 500});
		}

		return NextResponse.json({message: "Site order updated successfully"}, {status: 200});
	} catch (err) {
		console.error("Server error reordering sites:", err);
		return NextResponse.json({error: "Invalid request body or server error"}, {status: 500});
	}
}
