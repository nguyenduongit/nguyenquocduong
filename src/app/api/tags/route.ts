import {supabase} from "@/lib/supabaseClient";
import {NextResponse, NextRequest} from "next/server";

// GET: Lấy danh sách tags theo category_id, sắp xếp theo vị trí
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const categoryId = searchParams.get("categoryId");
	if (!categoryId) return NextResponse.json({error: "categoryId is required"}, {status: 400});

	const {data, error} = await supabase
		.from("tags")
		.select("*")
		.eq("category_id", categoryId)
		.order("position", {ascending: true, nullsFirst: false})
		.order("created_at", {ascending: true});

	if (error) return NextResponse.json({error: error.message}, {status: 500});
	return NextResponse.json(data);
}

// POST: Tạo một tag mới
export async function POST(request: Request) {
	const {name, category_id} = await request.json();
	if (!name || !category_id) return NextResponse.json({error: "Name and category_id are required"}, {status: 400});

	// Lấy vị trí cuối cùng để thêm tag mới
	const {count, error: countError} = await supabase.from("tags").select("*", {count: "exact", head: true}).eq("category_id", category_id);

	if (countError) {
		return NextResponse.json({error: countError.message}, {status: 500});
	}
	const newPosition = count ?? 0;

	const {data, error} = await supabase
		.from("tags")
		.insert([{name, category_id, position: newPosition}])
		.select()
		.single();
	if (error) return NextResponse.json({error: error.message}, {status: 500});

	return NextResponse.json(data, {status: 201});
}

// PUT: Cập nhật một tag
export async function PUT(request: Request) {
	const {id, name} = await request.json();
	if (!id || !name) return NextResponse.json({error: "ID and name are required"}, {status: 400});

	const {data, error} = await supabase.from("tags").update({name}).eq("id", id).select().single();
	if (error) return NextResponse.json({error: error.message}, {status: 500});

	return NextResponse.json(data);
}

// DELETE: Xóa một tag
export async function DELETE(request: Request) {
	const {id} = await request.json();
	if (!id) return NextResponse.json({error: "ID is required"}, {status: 400});

	const {error} = await supabase.from("tags").delete().eq("id", id);
	if (error) return NextResponse.json({error: error.message}, {status: 500});

	return NextResponse.json({message: "Tag deleted successfully"});
}
