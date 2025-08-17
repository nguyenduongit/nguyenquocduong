"use client";
import {useState, useEffect, FormEvent} from "react";
import styles from "./Modal.module.css";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (name: string) => void;
	initialName?: string;
	title: string;
}

export default function CategoryTagModal({isOpen, onClose, onSave, initialName = "", title}: ModalProps) {
	const [name, setName] = useState(initialName);

	useEffect(() => {
		setName(initialName);
	}, [initialName, isOpen]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onSave(name);
	};

	if (!isOpen) return null;

	return (
		<div className={styles.overlay}>
			<div className={styles.modal} style={{maxWidth: "24rem"}}>
				<h2 className={styles.title} style={{fontSize: "1.25rem"}}>
					{title}
				</h2>
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor="name" className={styles.label}>
							Name
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className={styles.input}
							autoFocus
						/>
					</div>
					<div className={styles.actions}>
						<button type="button" onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>
							Cancel
						</button>
						<button type="submit" className={`${styles.button} ${styles.saveButton}`}>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
