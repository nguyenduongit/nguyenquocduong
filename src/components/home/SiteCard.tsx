"use client";
import {useState, useEffect, useRef} from "react";
import {Site} from "../../services/siteService";
import styles from "./SiteCard.module.css";

interface SiteCardProps {
	site: Site;
	onEdit: (site: Site) => void;
	onDelete: (id: string) => void;
	isLayoutEditMode: boolean;
	onDragStart: (e: React.DragEvent<HTMLDivElement>, siteId: string) => void;
	onDrop: (e: React.DragEvent<HTMLDivElement>, targetSiteId: string) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

interface ContextMenu {
	visible: boolean;
	x: number;
	y: number;
}

const getFaviconUrl = (url: string) => {
	try {
		const domain = new URL(url).hostname;
		return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
	} catch (error) {
		return "default-icon.png";
	}
};

export default function SiteCard({site, onEdit, onDelete, isLayoutEditMode, onDragStart, onDrop, onDragEnd}: SiteCardProps) {
	const favicon = site.icon || getFaviconUrl(site.url);
	const [contextMenu, setContextMenu] = useState<ContextMenu>({visible: false, x: 0, y: 0});
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (contextMenu.visible && menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setContextMenu({...contextMenu, visible: false});
			}
		};
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [contextMenu]);

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		if (!isLayoutEditMode) {
			setContextMenu({visible: true, x: e.pageX, y: e.pageY});
		}
	};

	const handleEdit = () => {
		onEdit(site);
	};

	const handleDelete = () => {
		onDelete(site.id);
	};

	const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (isLayoutEditMode) {
			e.preventDefault();
		}
	};

	// Thêm các hàm xử lý mới
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.currentTarget.classList.add(styles.dragOver);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.currentTarget.classList.remove(styles.dragOver);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSiteId: string) => {
		onDrop(e, targetSiteId);
		e.currentTarget.classList.remove(styles.dragOver);
	};

	return (
		<>
			<div
				className={`${styles.card} ${isLayoutEditMode ? styles.editMode : ""}`}
				onContextMenu={handleContextMenu}
				draggable={isLayoutEditMode}
				onDragStart={(e) => onDragStart(e, site.id)}
				onDrop={(e) => handleDrop(e, site.id)}
				onDragEnd={onDragEnd}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				data-site-id={site.id}
			>
				<a href={site.url} target="_blank" rel="noopener noreferrer" className={styles.link} onClick={handleLinkClick}>
					<div className={styles.header}>
						<img src={favicon} alt={`${site.title} favicon`} className={styles.favicon} />
						<h3 className={styles.title}>{site.title}</h3>
					</div>
					{site.description && <p className={styles.description}>{site.description}</p>}
				</a>
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
		</>
	);
}
