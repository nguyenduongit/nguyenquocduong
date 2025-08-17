// src/components/home/HomePage.tsx
"use client";

import {useEffect, useState, useRef, useMemo} from "react";
import CRUDModal from "./CRUDModal";
import SiteCard from "./SiteCard";
import TabNavigation from "./TabNavigation";
import TagBar from "./TagBar";
import CategoryTagModal from "./CategoryTagModal";
import SearchBar from "./SearchBar";

import {Category, getCategories, createCategory, updateCategory, deleteCategory, updateCategoryOrder} from "@/services/categoryService";
import {createSite, deleteSite, Site, updateSite, updateSiteOrder, getAllSites} from "@/services/siteService";
import {Tag, createTag, updateTag, deleteTag, updateTagOrder, getAllTags} from "@/services/tagService";
import styles from "./HomePage.module.css";

export default function HomePage() {
	// States lưu trữ toàn bộ dữ liệu
	const [categories, setCategories] = useState<Category[]>([]);
	const [allTags, setAllTags] = useState<Tag[]>([]);
	const [allSites, setAllSites] = useState<Site[]>([]);

	// States cho trạng thái UI
	const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
	const [activeTagId, setActiveTagId] = useState<string | null>(null);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	// States cho Modals
	const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
	const [editingSite, setEditingSite] = useState<Site | null>(null);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [isTagModalOpen, setIsTagModalOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<Tag | null>(null);

	// States cho chế độ sắp xếp (Layout Edit Mode)
	const [isLayoutEditMode, setIsLayoutEditMode] = useState(false);
	const [hasCategoryOrderChanged, setHasCategoryOrderChanged] = useState(false);
	const [hasTagOrderChanged, setHasTagOrderChanged] = useState(false);
	const [hasSiteOrderChanged, setHasSiteOrderChanged] = useState(false);

	// Refs để lưu trạng thái ban đầu khi bật chế độ sắp xếp
	const originalCategoriesOrder = useRef<Category[]>([]);
	const originalTagsOrder = useRef<Tag[]>([]);
	const originalSitesOrder = useRef<Site[]>([]);
	const draggedItemId = useRef<string | null>(null);
	const draggedItemType = useRef<"category" | "tag" | "site" | null>(null);

	// Tải tất cả dữ liệu ban đầu
	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				setIsInitialLoading(true);
				setError(null);
				const [fetchedCategories, allSitesData, allTagsData] = await Promise.all([getCategories(), getAllSites(), getAllTags()]);

				setCategories(fetchedCategories);
				setAllSites(allSitesData);
				setAllTags(allTagsData);

				if (fetchedCategories.length > 0 && !activeCategoryId) {
					setActiveCategoryId(fetchedCategories[0].id);
				} else if (fetchedCategories.length === 0) {
					setActiveCategoryId(null);
				}
			} catch (err) {
				setError("Không thể tải dữ liệu ban đầu. Vui lòng thử lại.");
				console.error(err);
			} finally {
				setIsInitialLoading(false);
			}
		};
		fetchInitialData();
	}, []);

	// Khi chuyển category, reset activeTagId
	useEffect(() => {
		setActiveTagId(null);
	}, [activeCategoryId]);

	// === LỌC DỮ LIỆU PHÍA CLIENT ===
	const displayedTags = useMemo(() => {
		if (!activeCategoryId) return [];
		return allTags.filter((tag) => tag.category_id === activeCategoryId);
	}, [allTags, activeCategoryId]);

	const displayedSites = useMemo(() => {
		if (searchQuery) {
			return allSites.filter((site) => site.title.toLowerCase().includes(searchQuery.toLowerCase()));
		}
		if (!activeCategoryId) return [];
		let filtered = allSites.filter((site) => site.category_id === activeCategoryId);
		if (activeTagId) {
			filtered = filtered.filter((site) => site.tag_id === activeTagId);
		}
		return filtered;
	}, [allSites, activeCategoryId, activeTagId, searchQuery]);

	// === BỘ HÀM KÉO THẢ ===
	const handleDragStart = (e: React.DragEvent, id: string, type: "category" | "tag" | "site") => {
		draggedItemId.current = id;
		draggedItemType.current = type;
		e.dataTransfer.effectAllowed = "move";
		(e.currentTarget as HTMLElement).classList.add(styles.dragging);
	};

	const handleDrop = (e: React.DragEvent, targetId: string) => {
		e.preventDefault();
		if (!draggedItemId.current || draggedItemId.current === targetId) return;

		switch (draggedItemType.current) {
			case "category":
				const newCategories = [...categories];
				const draggedCatIndex = newCategories.findIndex((c) => c.id === draggedItemId.current);
				const targetCatIndex = newCategories.findIndex((c) => c.id === targetId);
				const [draggedCat] = newCategories.splice(draggedCatIndex, 1);
				newCategories.splice(targetCatIndex, 0, draggedCat);
				setCategories(newCategories);
				setHasCategoryOrderChanged(true);
				break;
			case "tag":
				// Sắp xếp trên `allTags` để giữ đúng thứ tự toàn cục
				const newAllTags = [...allTags];
				const draggedTagIndex = newAllTags.findIndex((t) => t.id === draggedItemId.current);
				const targetTagIndex = newAllTags.findIndex((t) => t.id === targetId);
				const [draggedTag] = newAllTags.splice(draggedTagIndex, 1);
				newAllTags.splice(targetTagIndex, 0, draggedTag);
				setAllTags(newAllTags);
				setHasTagOrderChanged(true);
				break;
			case "site":
				// Sắp xếp trên `allSites` để giữ đúng thứ tự toàn cục
				const newAllSites = [...allSites];
				const draggedSiteIndex = newAllSites.findIndex((s) => s.id === draggedItemId.current);
				const targetSiteIndex = newAllSites.findIndex((s) => s.id === targetId);
				const [draggedSite] = newAllSites.splice(draggedSiteIndex, 1);
				newAllSites.splice(targetSiteIndex, 0, draggedSite);
				setAllSites(newAllSites);
				setHasSiteOrderChanged(true);
				break;
		}
		draggedItemId.current = null;
		draggedItemType.current = null;
	};

	const handleDragEnd = (e: React.DragEvent) => {
		(e.currentTarget as HTMLElement).classList.remove(styles.dragging);
		document.querySelectorAll(".dragOver").forEach((el) => el.classList.remove("dragOver"));
	};

	// === HÀM LƯU VÀ HỦY SẮP XẾP ===
	const handleToggleLayoutEditMode = async () => {
		const isTogglingOff = isLayoutEditMode;
		setIsLayoutEditMode(!isLayoutEditMode);

		if (isTogglingOff) {
			try {
				const promises = [];
				if (hasCategoryOrderChanged) {
					promises.push(updateCategoryOrder(categories.map((c) => c.id)));
				}
				if (hasTagOrderChanged) {
					promises.push(updateTagOrder(displayedTags.map((t) => t.id)));
				}
				if (hasSiteOrderChanged) {
					promises.push(updateSiteOrder(displayedSites.map((s) => s.id)));
				}
				await Promise.all(promises);
				setHasCategoryOrderChanged(false);
				setHasTagOrderChanged(false);
				setHasSiteOrderChanged(false);
			} catch (error) {
				alert("Đã có lỗi xảy ra khi lưu thứ tự mới.");
				handleCancelLayoutEdit();
			}
		} else {
			originalCategoriesOrder.current = [...categories];
			originalTagsOrder.current = [...displayedTags];
			originalSitesOrder.current = [...displayedSites];
		}
	};

	const handleCancelLayoutEdit = () => {
		setIsLayoutEditMode(false);
		if (hasCategoryOrderChanged) setCategories(originalCategoriesOrder.current);
		if (hasTagOrderChanged) setAllTags((prev) => [...prev]); // Force re-render for tags
		if (hasSiteOrderChanged) setAllSites((prev) => [...prev]); // Force re-render for sites
		setHasCategoryOrderChanged(false);
		setHasTagOrderChanged(false);
		setHasSiteOrderChanged(false);
	};

	// === CÁC HÀM CRUD (ĐÃ CẬP NHẬT) ===
	const handleSaveSite = async (formData: any, id?: string) => {
		try {
			let savedSite: Site;
			if (id) {
				savedSite = await updateSite({...formData, id});
				setAllSites(allSites.map((s) => (s.id === id ? savedSite : s)));
			} else {
				savedSite = await createSite(formData);
				setAllSites((prev) => [...prev, savedSite]);
			}
			closeSiteModal();
		} catch (err) {
			console.error(err);
			alert("Lỗi: Không thể lưu site.");
		}
	};

	const handleDeleteSite = async (id: string) => {
		if (window.confirm("Bạn chắc chắn muốn xóa site này?")) {
			try {
				await deleteSite(id);
				setAllSites(allSites.filter((s) => s.id !== id));
			} catch (err) {
				console.error(err);
				alert("Lỗi: Không thể xóa site.");
			}
		}
	};

	const handleSaveCategory = async (name: string) => {
		try {
			if (editingCategory) {
				const updated = await updateCategory(editingCategory.id, name);
				setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
			} else {
				const newCategory = await createCategory(name);
				setCategories([...categories, newCategory]);
				setActiveCategoryId(newCategory.id);
			}
			closeCategoryModal();
		} catch (err) {
			console.error(err);
			alert("Lỗi: Không thể lưu category.");
		}
	};

	const handleDeleteCategory = async (id: string) => {
		if (window.confirm("CẢNH BÁO: Xóa category sẽ xóa TẤT CẢ tags và sites bên trong. Bạn chắc chắn muốn xóa?")) {
			try {
				await deleteCategory(id);
				const remainingCategories = categories.filter((c) => c.id !== id);
				setCategories(remainingCategories);
				// Xóa tags và sites liên quan khỏi state
				setAllTags(allTags.filter((t) => t.category_id !== id));
				setAllSites(allSites.filter((s) => s.category_id !== id));

				if (activeCategoryId === id) {
					setActiveCategoryId(remainingCategories.length > 0 ? remainingCategories[0].id : null);
				}
			} catch (err) {
				console.error(err);
				alert("Lỗi: Không thể xóa category.");
			}
		}
	};

	const handleSaveTag = async (name: string) => {
		if (!activeCategoryId) return;
		try {
			if (editingTag) {
				const updated = await updateTag(editingTag.id, name);
				setAllTags(allTags.map((t) => (t.id === updated.id ? updated : t)));
			} else {
				const newTag = await createTag(name, activeCategoryId);
				setAllTags([...allTags, newTag]);
				setActiveTagId(newTag.id);
			}
			closeTagModal();
		} catch (err) {
			console.error(err);
			alert("Lỗi: Không thể lưu tag.");
		}
	};

	const handleDeleteTag = async (id: string) => {
		if (window.confirm("Bạn chắc chắn muốn xóa tag này?")) {
			try {
				await deleteTag(id);
				setAllTags(allTags.filter((t) => t.id !== id));
				// Cần cập nhật lại allSites để loại bỏ tag_id đã xóa
				setAllSites(allSites.map((s) => (s.tag_id === id ? {...s, tag_id: ""} : s)));

				if (activeTagId === id) {
					setActiveTagId(null);
				}
			} catch (err) {
				console.error(err);
				alert("Lỗi: Không thể xóa tag.");
			}
		}
	};

	const openSiteModalForEdit = (site: Site) => {
		setEditingSite(site);
		setIsSiteModalOpen(true);
	};
	const openSiteModalForCreate = () => {
		setEditingSite(null);
		setIsSiteModalOpen(true);
	};
	const closeSiteModal = () => setIsSiteModalOpen(false);

	const openCategoryModalForEdit = (category: Category) => {
		setEditingCategory(category);
		setIsCategoryModalOpen(true);
	};
	const openCategoryModalForCreate = () => {
		setEditingCategory(null);
		setIsCategoryModalOpen(true);
	};
	const closeCategoryModal = () => setIsCategoryModalOpen(false);

	const openTagModalForEdit = (tag: Tag) => {
		setEditingTag(tag);
		setIsTagModalOpen(true);
	};
	const openTagModalForCreate = () => {
		setEditingTag(null);
		setIsTagModalOpen(true);
	};
	const closeTagModal = () => setIsTagModalOpen(false);

	const hasOrderChanged = hasCategoryOrderChanged || hasTagOrderChanged || hasSiteOrderChanged;

	if (isInitialLoading) return <div className={styles.loading}>Đang tải...</div>;
	if (error) return <div className={styles.error}>{error}</div>;

	return (
		<main>
			<section className={styles.tabNavigationWrapper}>
				<div className={styles.container}>
					<TabNavigation
						categories={categories}
						activeCategoryId={activeCategoryId}
						onSelectCategory={setActiveCategoryId}
						onAdd={openCategoryModalForCreate}
						onEdit={openCategoryModalForEdit}
						onDelete={handleDeleteCategory}
						isLayoutEditMode={isLayoutEditMode}
						onToggleLayoutEdit={handleToggleLayoutEditMode}
						onDragStart={(e, id) => handleDragStart(e, id, "category")}
						onDrop={handleDrop}
					/>
				</div>
			</section>

			<div className={styles.container}>
				{/* === CONTAINER ĐÃ ĐƯỢC DI CHUYỂN LÊN TRÊN === */}
				{isLayoutEditMode && (
					<div className={styles.editLayoutActions}>
						<p className={styles.editLayoutText}>Bạn đang ở chế độ sắp xếp. Kéo và thả để thay đổi vị trí.</p>
						<div>
							<button onClick={handleCancelLayoutEdit} className={`${styles.actionButton} ${styles.cancelButton}`}>
								Hủy
							</button>
							<button
								onClick={handleToggleLayoutEditMode}
								disabled={!hasOrderChanged}
								className={`${styles.actionButton} ${styles.saveButton}`}
							>
								Lưu thay đổi
							</button>
						</div>
					</div>
				)}

				<section className={styles.searchSectionWrapper}>
					<SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
				</section>

				{searchQuery ? (
					<section className={styles.sitesSection}>
						<h2 className={styles.searchResultsTitle}>Kết quả tìm kiếm cho: "{searchQuery}"</h2>
						{displayedSites.length > 0 ? (
							<div className={styles.sitesGrid}>
								{displayedSites.map((site) => (
									<SiteCard
										key={site.id}
										site={site}
										onEdit={openSiteModalForEdit}
										onDelete={handleDeleteSite}
										isLayoutEditMode={false}
										onDragStart={() => {}}
										onDrop={() => {}}
										onDragEnd={handleDragEnd}
									/>
								))}
							</div>
						) : (
							<div className={styles.emptyState}>
								<p className={styles.emptyStateText}>Không tìm thấy trang web nào khớp với "{searchQuery}".</p>
							</div>
						)}
					</section>
				) : (
					<>
						<section className={styles.section}>
							<TagBar
								tags={displayedTags}
								activeTagId={activeTagId}
								onSelectTag={setActiveTagId}
								onAdd={openTagModalForCreate}
								onEdit={openTagModalForEdit}
								onDelete={handleDeleteTag}
								isLayoutEditMode={isLayoutEditMode}
								onDragStart={(e, id) => handleDragStart(e, id, "tag")}
								onDrop={handleDrop}
							/>
						</section>

						<section className={styles.sitesSection}>
							{displayedSites.length > 0 ? (
								<div className={styles.sitesGrid}>
									{displayedSites.map((site) => (
										<SiteCard
											key={site.id}
											site={site}
											onEdit={openSiteModalForEdit}
											onDelete={handleDeleteSite}
											isLayoutEditMode={isLayoutEditMode}
											onDragStart={(e) => handleDragStart(e, site.id, "site")}
											onDrop={handleDrop}
											onDragEnd={handleDragEnd}
										/>
									))}
								</div>
							) : (
								<div className={styles.emptyState}>
									<p className={styles.emptyStateText}>Chưa có trang web nào trong mục này.</p>
								</div>
							)}
						</section>
					</>
				)}
				<button onClick={openSiteModalForCreate} className={styles.fab} title="Add New Site">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
						<path
							fillRule="evenodd"
							d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</div>

			<CRUDModal isOpen={isSiteModalOpen} onClose={closeSiteModal} onSave={handleSaveSite} categories={categories} initialData={editingSite} />
			<CategoryTagModal
				isOpen={isCategoryModalOpen}
				onClose={closeCategoryModal}
				onSave={handleSaveCategory}
				initialName={editingCategory?.name}
				title={editingCategory ? "Edit Category" : "Add New Category"}
			/>
			<CategoryTagModal
				isOpen={isTagModalOpen}
				onClose={closeTagModal}
				onSave={handleSaveTag}
				initialName={editingTag?.name}
				title={editingTag ? "Edit Tag" : "Add New Tag"}
			/>
		</main>
	);
}
