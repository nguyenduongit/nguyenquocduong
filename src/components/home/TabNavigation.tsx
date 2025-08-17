"use client";
import {useState, useEffect, useRef} from "react";
import {Category} from "../../services/categoryService";
import styles from "./TabNavigation.module.css";

interface TabNavigationProps {
	categories: Category[];
	activeCategoryId: string | null;
	onSelectCategory: (id: string) => void;
	onAdd: () => void;
	onEdit: (category: Category) => void;
	onDelete: (id: string) => void;
	isLayoutEditMode: boolean;
	onToggleLayoutEdit: () => void;
	// Thêm props cho drag-drop
	onDragStart: (e: React.DragEvent<HTMLDivElement>, categoryId: string) => void;
	onDrop: (e: React.DragEvent<HTMLDivElement>, targetCategoryId: string) => void;
}

interface ContextMenu {
	visible: boolean;
	x: number;
	y: number;
	category: Category | null;
}

export default function TabNavigation({
	categories,
	activeCategoryId,
	onSelectCategory,
	onAdd,
	onEdit,
	onDelete,
	isLayoutEditMode,
	onToggleLayoutEdit,
	onDragStart,
	onDrop,
}: TabNavigationProps) {
	const [contextMenu, setContextMenu] = useState<ContextMenu>({visible: false, x: 0, y: 0, category: null});
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = () => setContextMenu({...contextMenu, visible: false});
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [contextMenu]);

	const handleContextMenu = (e: React.MouseEvent, category: Category) => {
		e.preventDefault();
		if (category.id === activeCategoryId && !isLayoutEditMode) {
			setContextMenu({visible: true, x: e.pageX, y: e.pageY, category});
		}
	};

	const handleEdit = () => {
		if (contextMenu.category) {
			onEdit(contextMenu.category);
		}
	};

	const handleDelete = () => {
		if (contextMenu.category) {
			onDelete(contextMenu.category.id);
		}
	};

	// Xử lý sự kiện kéo qua
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.currentTarget.classList.add(styles.dragOver);
	};

	// Xử lý sự kiện rời khỏi
	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.currentTarget.classList.remove(styles.dragOver);
	};

	// Xử lý sự kiện thả
	const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCategoryId: string) => {
		onDrop(e, targetCategoryId);
		e.currentTarget.classList.remove(styles.dragOver);
	};

	return (
		<div className={styles.container}>
			<div className={styles.flexContainer}>
				<nav className={`${styles.nav} ${isLayoutEditMode ? styles.editMode : ""}`}>
					{categories.map((category) => (
						<div
							key={category.id}
							className={styles.tabItem}
							draggable={isLayoutEditMode}
							onDragStart={(e) => onDragStart(e, category.id)}
							onDrop={(e) => handleDrop(e, category.id)}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
						>
							<button
								onClick={() => onSelectCategory(category.id)}
								onContextMenu={(e) => handleContextMenu(e, category)}
								className={`${styles.tabButton} ${category.id === activeCategoryId ? styles.active : ""}`}
								// Vô hiệu hóa click khi đang sắp xếp
								style={{pointerEvents: isLayoutEditMode ? "none" : "auto"}}
							>
								{category.name}
							</button>
						</div>
					))}
					<div className={styles.tabItem}>
						<button onClick={onAdd} className={styles.tabButton} title="Add New Category">
							 + 
						</button>
					</div>
				</nav>

				{/* === ICON SVG MỚI ĐÃ ĐƯỢC CẬP NHẬT === */}
				<button
					onClick={onToggleLayoutEdit}
					className={`${styles.modifyButton} ${isLayoutEditMode ? styles.active : ""}`}
					title="Modify layout"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<title />
						<path
							d="M17,22H5a3,3,0,0,1-3-3V7A3,3,0,0,1,5,4H9A1,1,0,0,1,9,6H5A1,1,0,0,0,4,7V19a1,1,0,0,0,1,1H17a1,1,0,0,0,1-1V15a1,1,0,0,1,2,0v4A3,3,0,0,1,17,22Z"
							fill="currentColor"
						/>
						<path
							d="M14.6,5.87l-4.95,5a.41.41,0,0,0-.13.23l-1,3.82a.48.48,0,0,0,.13.48A.47.47,0,0,0,9,15.5a.32.32,0,0,0,.13,0l3.82-1a.41.41,0,0,0,.23-.13L18.13,9.4Z"
							fill="currentColor"
						/>
						<path d="M21,4.45,19.55,3a1.52,1.52,0,0,0-2.13,0L16,4.45,19.55,8,21,6.58A1.52,1.52,0,0,0,21,4.45Z" fill="currentColor" />
					</svg>
				</button>
			</div>

			{contextMenu.visible && (
				<div ref={menuRef} className={styles.contextMenu} style={{top: `${contextMenu.y}px`, left: `${contextMenu.x}px`}}>
					<button onClick={handleEdit} className={styles.menuItem}>
						Edit
					</button>
					<button onClick={handleDelete} className={`${styles.menuItem} ${styles.delete}`}>
						Delete
					</button>
				</div>
			)}
		</div>
	);
}
