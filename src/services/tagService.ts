// src/services/tagService.ts
export interface Tag {
	id: string;
	category_id: string;
	name: string;
	created_at: string;
	position?: number; // Thêm trường position
}

export const getTagsByCategoryId = async (categoryId: string): Promise<Tag[]> => {
	const response = await fetch(`/api/tags?categoryId=${categoryId}`);
	if (!response.ok) throw new Error("Failed to fetch tags");
	return response.json();
};

// THÊM HÀM MỚI
export const getAllTags = async (): Promise<Tag[]> => {
	const response = await fetch(`/api/tags/all`);
	if (!response.ok) throw new Error("Failed to fetch all tags");
	return response.json();
};

export const createTag = async (name: string, category_id: string): Promise<Tag> => {
	const response = await fetch("/api/tags", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({name, category_id}),
	});
	if (!response.ok) throw new Error("Failed to create tag");
	return response.json();
};

export const updateTag = async (id: string, name: string): Promise<Tag> => {
	const response = await fetch("/api/tags", {
		method: "PUT",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({id, name}),
	});
	if (!response.ok) throw new Error("Failed to update tag");
	return response.json();
};

export const deleteTag = async (id: string): Promise<void> => {
	const response = await fetch("/api/tags", {
		method: "DELETE",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({id}),
	});
	if (!response.ok) throw new Error("Failed to delete tag");
};

export const updateTagOrder = async (tagIds: string[]): Promise<void> => {
	const response = await fetch("/api/tags/reorder", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({tagIds}),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to update tag order");
	}
};
