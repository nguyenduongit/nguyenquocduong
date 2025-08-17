export interface Category {
	id: string;
	name: string;
	created_at: string;
	position?: number; // Thêm trường position
}

export const getCategories = async (): Promise<Category[]> => {
	const response = await fetch("/api/categories");
	if (!response.ok) throw new Error("Failed to fetch categories");
	return response.json();
};

export const createCategory = async (name: string): Promise<Category> => {
	const response = await fetch("/api/categories", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({name}),
	});
	if (!response.ok) throw new Error("Failed to create category");
	return response.json();
};

export const updateCategory = async (id: string, name: string): Promise<Category> => {
	const response = await fetch("/api/categories", {
		method: "PUT",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({id, name}),
	});
	if (!response.ok) throw new Error("Failed to update category");
	return response.json();
};

export const deleteCategory = async (id: string): Promise<void> => {
	const response = await fetch("/api/categories", {
		method: "DELETE",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({id}),
	});
	if (!response.ok) throw new Error("Failed to delete category");
};

// THÊM HÀM MỚI
export const updateCategoryOrder = async (categoryIds: string[]): Promise<void> => {
	const response = await fetch("/api/categories/reorder", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({categoryIds}),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to update category order");
	}
};
