"use client";
import {useState, useEffect, FormEvent} from "react";
import {Category} from "../../services/categoryService";
import {Tag, getTagsByCategoryId} from "../../services/tagService";
import {Site} from "../../services/siteService";
import styles from "./Modal.module.css";

interface CRUDModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (formData: any, id?: string) => void;
	categories: Category[];
	initialData?: Site | null;
}

export default function CRUDModal({isOpen, onClose, onSave, categories, initialData}: CRUDModalProps) {
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [description, setDescription] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const [selectedTagId, setSelectedTagId] = useState("");
	const [availableTags, setAvailableTags] = useState<Tag[]>([]);

	const isEditMode = !!initialData;

	useEffect(() => {
		if (isOpen && initialData) {
			setTitle(initialData.title);
			setUrl(initialData.url);
			setDescription(initialData.description || "");
			setSelectedCategoryId(initialData.category_id);
			getTagsByCategoryId(initialData.category_id).then((tags) => {
				setAvailableTags(tags);
				setSelectedTagId(initialData.tag_id);
			});
		} else {
			setTitle("");
			setUrl("");
			setDescription("");
			setSelectedCategoryId("");
			setSelectedTagId("");
			setAvailableTags([]);
		}
	}, [isOpen, initialData]);

	useEffect(() => {
		if (selectedCategoryId) {
			if (!isEditMode || selectedCategoryId !== initialData?.category_id) {
				getTagsByCategoryId(selectedCategoryId).then((tags) => {
					setAvailableTags(tags);
					setSelectedTagId("");
				});
			}
		} else {
			setAvailableTags([]);
		}
	}, [selectedCategoryId, isEditMode, initialData]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const formData = {title, url, description, category_id: selectedCategoryId, tag_id: selectedTagId};
		onSave(formData, initialData?.id);
	};

	if (!isOpen) return null;

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h2 className={styles.title}>{isEditMode ? "Edit Site" : "Add New Site"}</h2>
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor="title" className={styles.label}>
							Title
						</label>
						<input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={styles.input} />
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="url" className={styles.label}>
							URL
						</label>
						<input type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required className={styles.input} />
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="description" className={styles.label}>
							Description
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
							className={styles.textarea}
						></textarea>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="category" className={styles.label}>
							Category
						</label>
						<select
							id="category"
							value={selectedCategoryId}
							onChange={(e) => setSelectedCategoryId(e.target.value)}
							required
							className={styles.select}
						>
							<option value="" disabled>
								Select a category
							</option>
							{categories.map((cat) => (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
							))}
						</select>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="tag" className={styles.label}>
							Tag
						</label>
						<select
							id="tag"
							value={selectedTagId}
							onChange={(e) => setSelectedTagId(e.target.value)}
							required
							disabled={!selectedCategoryId}
							className={styles.select}
						>
							<option value="" disabled>
								Select a tag
							</option>
							{availableTags.map((tag) => (
								<option key={tag.id} value={tag.id}>
									{tag.name}
								</option>
							))}
						</select>
					</div>
					<div className={styles.actions}>
						<button type="button" onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>
							Cancel
						</button>
						<button type="submit" className={`${styles.button} ${styles.saveButton}`}>
							{isEditMode ? "Update Site" : "Save Site"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
