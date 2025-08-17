import {supabase} from "@/lib/supabaseClient";
import {NextResponse, NextRequest} from "next/server";

// GET: Lấy danh sách sites. Nếu có categoryId, lọc theo category. Nếu không, lấy tất cả.
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const categoryId = searchParams.get("categoryId");
	const tagId = searchParams.get("tagId");

	let query = supabase.from("sites").select("*");

	if (categoryId) {
		query = query.eq("category_id", categoryId);
	}

	if (tagId) {
		query = query.eq("tag_id", tagId);
	}

	// Sắp xếp theo 'position' trước, sau đó là 'created_at'
	const {data, error} = await query.order("position", {ascending: true, nullsFirst: false}).order("created_at", {ascending: true});

	if (error) {
		console.error("Supabase error fetching sites:", error.message);
		return NextResponse.json({error: error.message}, {status: 500});
	}

	return NextResponse.json(data);
}

// POST: Tạo một site mới
export async function POST(request: Request) {
	try {
		const {category_id, tag_id, title, url, description, icon} = await request.json();

		if (!category_id || !tag_id || !title || !url) {
			return NextResponse.json({error: "Missing required fields"}, {status: 400});
		}

		// Thêm site mới vào cuối danh sách bằng cách lấy vị trí cuối cùng
		const {count, error: countError} = await supabase
			.from("sites")
			.select("*", {count: "exact", head: true})
			.eq("category_id", category_id)
			.eq("tag_id", tag_id);

		if (countError) {
			console.error("Supabase error counting sites:", countError.message);
			return NextResponse.json({error: countError.message}, {status: 500});
		}

		const newPosition = count ?? 0;

		const {data, error} = await supabase
			.from("sites")
			.insert([{category_id, tag_id, title, url, description, icon, position: newPosition}])
			.select()
			.single();

		if (error) {
			console.error("Supabase error creating site:", error.message);
			return NextResponse.json({error: error.message}, {status: 500});
		}

		return NextResponse.json(data, {status: 201});
	} catch (err) {
		return NextResponse.json({error: "Invalid request body"}, {status: 400});
	}
}

// PUT: Cập nhật một site đã có
export async function PUT(request: Request) {
	try {
		const {id, category_id, tag_id, title, url, description, icon} = await request.json();

		if (!id) {
			return NextResponse.json({error: "ID is required for updating"}, {status: 400});
		}

		const {data, error} = await supabase
			.from("sites")
			.update({category_id, tag_id, title, url, description, icon})
			.eq("id", id)
			.select()
			.single();

		if (error) {
			console.error("Supabase error updating site:", error.message);
			return NextResponse.json({error: error.message}, {status: 500});
		}

		return NextResponse.json(data, {status: 200});
	} catch (err) {
		return NextResponse.json({error: "Invalid request body"}, {status: 400});
	}
}

// DELETE: Xóa một site
export async function DELETE(request: Request) {
	try {
		const {id} = await request.json();

		if (!id) {
			return NextResponse.json({error: "ID is required for deleting"}, {status: 400});
		}

		const {error} = await supabase.from("sites").delete().eq("id", id);

		if (error) {
			console.error("Supabase error deleting site:", error.message);
			return NextResponse.json({error: error.message}, {status: 500});
		}

		return NextResponse.json({message: "Site deleted successfully"}, {status: 200});
	} catch (err) {
		return NextResponse.json({error: "Invalid request body"}, {status: 400});
	}
}
