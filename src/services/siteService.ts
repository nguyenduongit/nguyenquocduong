export interface Site {
	id: string;
	category_id: string;
	tag_id: string;
	title: string;
	url: string;
	icon?: string;
	description?: string;
	created_at: string;
	position?: number; // Thêm trường position
}

// THÊM HÀM MỚI
export const getAllSites = async (): Promise<Site[]> => {
	const response = await fetch("/api/sites");
	if (!response.ok) {
		throw new Error("Failed to fetch all sites");
	}
	return response.json();
};

export const getSites = async (categoryId: string, tagId: string | null): Promise<Site[]> => {
	let url = `/api/sites?categoryId=${categoryId}`;
	if (tagId) {
		url += `&tagId=${tagId}`;
	}

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch sites");
	}
	return response.json();
};

type NewSite = Omit<Site, "id" | "created_at">;

export const createSite = async (siteData: NewSite): Promise<Site> => {
	const response = await fetch("/api/sites", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(siteData),
	});

	if (!response.ok) {
		throw new Error("Failed to create site");
	}
	return response.json();
};

export const updateSite = async (siteData: Site): Promise<Site> => {
	const response = await fetch("/api/sites", {
		method: "PUT",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(siteData),
	});

	if (!response.ok) {
		throw new Error("Failed to update site");
	}
	return response.json();
};

export const deleteSite = async (id: string): Promise<void> => {
	const response = await fetch("/api/sites", {
		method: "DELETE",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({id}),
	});

	if (!response.ok) {
		throw new Error("Failed to delete site");
	}
};

// THÊM HÀM MỚI
export const updateSiteOrder = async (siteIds: string[]): Promise<void> => {
	const response = await fetch("/api/sites/reorder", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({siteIds}),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to update site order");
	}
};
