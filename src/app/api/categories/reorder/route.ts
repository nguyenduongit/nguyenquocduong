// src/app/api/categories/reorder/route.ts
import {supabase} from "@/lib/supabaseClient";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
	try {
		const {categoryIds}: {categoryIds: string[]} = await request.json();

		if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
			return NextResponse.json({error: "An array of categoryIds is required"}, {status: 400});
		}

		const updatePromises = categoryIds.map((id, index) => supabase.from("categories").update({position: index}).eq("id", id));

		const results = await Promise.all(updatePromises);
		const errors = results.filter((res) => res.error);

		if (errors.length > 0) {
			console.error(
				"Supabase errors during category reorder:",
				errors.map((e) => e.error?.message),
			);
			return NextResponse.json({error: errors[0].error?.message}, {status: 500});
		}

		return NextResponse.json({message: "Category order updated successfully"}, {status: 200});
	} catch (err) {
		console.error("Server error reordering categories:", err);
		return NextResponse.json({error: "Invalid request body or server error"}, {status: 500});
	}
}
