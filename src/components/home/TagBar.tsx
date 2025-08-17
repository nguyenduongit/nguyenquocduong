"use client";
import {useState, useEffect, useRef} from "react";
import {Tag} from "../../services/tagService";
import styles from "./TagBar.module.css";

interface TagBarProps {
	tags: Tag[];
	activeTagId: string | null;
	onSelectTag: (id: string | null) => void;
	onAdd: () => void;
	onEdit: (tag: Tag) => void;
	onDelete: (id: string) => void;
	// Thêm props mới
	isLayoutEditMode: boolean;
	onDragStart: (e: React.DragEvent<HTMLButtonElement>, tagId: string) => void;
	onDrop: (e: React.DragEvent<HTMLButtonElement>, targetTagId: string) => void;
}

interface ContextMenu {
	visible: boolean;
	x: number;
	y: number;
	tag: Tag | null;
}

export default function TagBar({tags, activeTagId, onSelectTag, onAdd, onEdit, onDelete, isLayoutEditMode, onDragStart, onDrop}: TagBarProps) {
	const [contextMenu, setContextMenu] = useState<ContextMenu>({visible: false, x: 0, y: 0, tag: null});
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = () => setContextMenu({...contextMenu, visible: false});
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [contextMenu]);

	const handleContextMenu = (e: React.MouseEvent, tag: Tag) => {
		e.preventDefault();
		if (tag.id === activeTagId && !isLayoutEditMode) {
			setContextMenu({visible: true, x: e.pageX, y: e.pageY, tag});
		}
	};

	const handleEdit = () => {
		if (contextMenu.tag) {
			onEdit(contextMenu.tag);
		}
	};

	const handleDelete = () => {
		if (contextMenu.tag) {
			onDelete(contextMenu.tag.id);
		}
	};

	// Xử lý sự kiện kéo qua
	const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.currentTarget.classList.add(styles.dragOver);
	};

	// Xử lý sự kiện rời khỏi
	const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
		e.currentTarget.classList.remove(styles.dragOver);
	};

	// Xử lý sự kiện thả
	const handleDrop = (e: React.DragEvent<HTMLButtonElement>, targetTagId: string) => {
		onDrop(e, targetTagId);
		e.currentTarget.classList.remove(styles.dragOver);
	};

	return (
		<div className={styles.container}>
			<div className={`${styles.tagGroup} ${isLayoutEditMode ? styles.editMode : ""}`}>
				{/* Nút All */}
				<button onClick={() => onSelectTag(null)} className={`${styles.tagButton} ${activeTagId === null ? styles.active : styles.inactive}`}>
					All
				</button>

				{/* Danh sách các Tag */}
				{tags.map((tag) => (
					<button
						key={tag.id}
						onClick={() => onSelectTag(tag.id)}
						onContextMenu={(e) => handleContextMenu(e, tag)}
						className={`${styles.tagButton} ${tag.id === activeTagId ? styles.active : styles.inactive}`}
						// Thêm thuộc tính kéo thả
						draggable={isLayoutEditMode}
						onDragStart={(e) => onDragStart(e, tag.id)}
						onDrop={(e) => handleDrop(e, tag.id)}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
					>
						{tag.name}
					</button>
				))}

				{/* Nút Add Tag */}
				<button onClick={onAdd} className={styles.addButton}>
					+ Add Tag
				</button>
			</div>

			{/* Context Menu */}
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
