const fs = require("fs");
const path = require("path");

const srcDir = path.resolve(__dirname); // Thư mục hiện tại (dự án React)
const destDir = path.resolve(__dirname, "../nguyenquocduong-backup"); // Nơi muốn copy tới

// Hàm copy thư mục, bỏ qua node_modules và .git
function copyDir(src, dest) {
	// Tạo thư mục đích nếu chưa tồn tại
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest, {recursive: true});
	}

	const entries = fs.readdirSync(src, {withFileTypes: true});

	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);

		// Bỏ qua thư mục node_modules và .git
		if (entry.isDirectory() && (entry.name === "node_modules" || entry.name === ".git")) {
			continue;
		}

		if (entry.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			try {
				fs.copyFileSync(srcPath, destPath);
			} catch (err) {
				console.error(`Lỗi khi sao chép ${srcPath}: ${err.message}`);
			}
		}
	}
}

// Chạy script
try {
	copyDir(srcDir, destDir);
	console.log(`✅ Copy hoàn tất vào: ${destDir}`);
} catch (err) {
	console.error(`Lỗi khi chạy script: ${err.message}`);
}
