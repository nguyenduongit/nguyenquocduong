"use client";
import {FormEvent} from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
	query: string;
	onQueryChange: (query: string) => void;
}

export default function SearchBar({query, onQueryChange}: SearchBarProps) {
	const handleGoogleSearch = (e: FormEvent) => {
		e.preventDefault(); // Ngăn trang tải lại
		if (query.trim()) {
			const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
			window.open(searchUrl, "_blank"); // Mở kết quả trong tab mới
		}
	};

	return (
		<form className={styles.container} onSubmit={handleGoogleSearch}>
			<div className={styles.iconWrapper}>
				<svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
			<input
				type="text"
				placeholder="Lọc trang hoặc nhấn Enter để tìm Google..."
				value={query}
				onChange={(e) => onQueryChange(e.target.value)}
				className={styles.input}
			/>
			<button type="submit" className={styles.button}>
				Google
			</button>
		</form>
	);
}
