import {supabase} from "@/lib/supabaseClient";
import {NextResponse} from "next/server";

// GET: Lấy danh sách tất cả categories, sắp xếp theo vị trí
export async function GET() {
	const {data, error} = await supabase
		.from("categories")
		.select("*")
		.order("position", {ascending: true, nullsFirst: false})
		.order("created_at", {ascending: true});

	if (error) {
		return NextResponse.json({error: error.message}, {status: 500});
	}

	return NextResponse.json(data);
}

// POST: Tạo một category mới
export async function POST(request: Request) {
	const {name} = await request.json();

	if (!name) {
		return NextResponse.json({error: "Name is required"}, {status: 400});
	}
	// Lấy vị trí cuối cùng để thêm category mới
	const {count, error: countError} = await supabase.from("categories").select("*", {count: "exact", head: true});

	if (countError) {
		return NextResponse.json({error: countError.message}, {status: 500});
	}
	const newPosition = count ?? 0;

	const {data, error} = await supabase
		.from("categories")
		.insert([{name, position: newPosition}])
		.select()
		.single();

	if (error) {
		return NextResponse.json({error: error.message}, {status: 500});
	}

	return NextResponse.json(data, {status: 201});
}

// PUT: Cập nhật một category
export async function PUT(request: Request) {
	const {id, name} = await request.json();

	if (!id || !name) {
		return NextResponse.json({error: "ID and name are required"}, {status: 400});
	}

	const {data, error} = await supabase.from("categories").update({name}).eq("id", id).select().single();

	if (error) {
		return NextResponse.json({error: error.message}, {status: 500});
	}

	return NextResponse.json(data);
}

// DELETE: Xóa một category
export async function DELETE(request: Request) {
	const {id} = await request.json();

	if (!id) {
		return NextResponse.json({error: "ID is required"}, {status: 400});
	}

	const {error} = await supabase.from("categories").delete().eq("id", id);

	if (error) {
		return NextResponse.json({error: error.message}, {status: 500});
	}

	return NextResponse.json({message: "Category deleted successfully"}, {status: 200});
}
