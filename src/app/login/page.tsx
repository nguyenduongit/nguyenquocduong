"use client";

import {useState, FormEvent} from "react";
import {useRouter} from "next/navigation";
import styles from "./Login.module.css";

export default function LoginPage() {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({password}),
			});

			if (response.ok) {
				router.push("/");
				router.refresh();
			} else {
				const data = await response.json();
				setError(data.message || "Mật khẩu không chính xác.");
			}
		} catch (err) {
			setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h1 className={styles.title}>Personal Hub Login</h1>
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor="password" className={styles.label}>
							Mật khẩu
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={styles.input}
							required
						/>
					</div>
					{error && <p className={styles.error}>{error}</p>}
					<button type="submit" className={styles.button}>
						Đăng nhập
					</button>
				</form>
			</div>
		</div>
	);
}
