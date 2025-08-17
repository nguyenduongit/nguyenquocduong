// src/app/api/tags/all/route.ts
import {supabase} from "@/lib/supabaseClient";
import {NextResponse} from "next/server";

// GET: Lấy tất cả các tag
export async function GET() {
	const {data, error} = await supabase
		.from("tags")
		.select("*")
		.order("position", {ascending: true, nullsFirst: false})
		.order("created_at", {ascending: true});

	if (error) {
		console.error("Supabase error fetching all tags:", error.message);
		return NextResponse.json({error: error.message}, {status: 500});
	}

	return NextResponse.json(data);
}
