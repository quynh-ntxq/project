# 🚀 Hướng dẫn triển khai lên GitHub Pages

## 📋 Bước 1: Chuẩn bị Repository

### 1.1 Tạo repository mới trên GitHub
1. Truy cập [GitHub.com](https://github.com)
2. Click "New repository"
3. Đặt tên repository (VD: `english-learning-app`)
4. Chọn "Public" (cần thiết cho GitHub Pages)
5. Không chọn README, .gitignore, license
6. Click "Create repository"

### 1.2 Kết nối local repository với GitHub
```bash
# Thêm remote origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push code lên GitHub
git add .
git commit -m "Initial commit: English learning app"
git branch -M main
git push -u origin main
```

## 📋 Bước 2: Upload file Excel

### 2.1 Upload file Excel lên repository
1. Vào repository trên GitHub
2. Click "Add file" > "Upload files"
3. Kéo thả file Excel vào
4. Commit với message: "Add Excel data file"
5. Click "Commit changes"

### 2.2 Lấy URL của file Excel
1. Click vào file Excel đã upload
2. Click "Download" hoặc copy URL
3. URL sẽ có dạng: `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/Uspeak_sample.xlsx`

## 📋 Bước 3: Cập nhật cấu hình

### 3.1 Cập nhật file config.js
```javascript
const CONFIG = {
    // Thay đổi URL này thành URL thực tế của bạn
    GITHUB_EXCEL_URL: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/Uspeak_sample.xlsx',
    // ...
};
```

### 3.2 Commit và push thay đổi
```bash
git add config.js
git commit -m "Update Excel file URL"
git push
```

## 📋 Bước 4: Kích hoạt GitHub Pages

### 4.1 Cấu hình GitHub Pages
1. Vào repository trên GitHub
2. Click "Settings" tab
3. Scroll xuống "Pages" section
4. Chọn "Source": "Deploy from a branch"
5. Chọn "Branch": "main"
6. Chọn "Folder": "/ (root)"
7. Click "Save"

### 4.2 Chờ deployment
- GitHub sẽ build và deploy trang web
- Có thể mất vài phút
- URL sẽ hiển thị: `https://YOUR_USERNAME.github.io/YOUR_REPO`

## 📋 Bước 5: Kiểm tra và test

### 5.1 Test trang web
1. Truy cập URL GitHub Pages
2. Test các tính năng:
   - Nhập mã lớp
   - Tự động tải Excel
   - Hiển thị câu hỏi
   - Phím tắt

### 5.2 Test admin panel
1. Truy cập `/admin.html`
2. Kiểm tra tự động tải Excel
3. Test tạo link cho các lớp

## 🔧 Troubleshooting

### Lỗi 404 khi truy cập
- Đảm bảo đã kích hoạt GitHub Pages
- Chờ vài phút để deployment hoàn tất
- Kiểm tra branch và folder đã chọn đúng

### Lỗi không tải được Excel
- Kiểm tra URL trong config.js
- Đảm bảo file Excel đã upload
- Kiểm tra quyền truy cập file (public)

### Lỗi CORS
- GitHub Pages hỗ trợ CORS
- Nếu vẫn lỗi, thử upload file thủ công

## 📱 Cách sử dụng sau khi deploy

### Cho học viên:
```
https://YOUR_USERNAME.github.io/YOUR_REPO
```

### Cho admin:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/admin.html
```

### Link trực tiếp cho lớp:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/study.html?class=TALK%20TO%20KID
```

## 🔄 Cập nhật dữ liệu

### Cách 1: Thay đổi file Excel
1. Upload file Excel mới lên GitHub
2. Commit thay đổi
3. Dữ liệu sẽ tự động cập nhật

### Cách 2: Thay đổi URL Excel
1. Edit file `config.js`
2. Commit và push
3. GitHub Pages sẽ tự động rebuild

## 📊 Monitoring

### Kiểm tra deployment
- Vào repository > Actions tab
- Xem status của GitHub Pages deployment

### Kiểm tra lỗi
- Mở Developer Tools (F12)
- Xem Console tab
- Kiểm tra Network tab khi tải Excel

---

**🎉 Chúc mừng! Ứng dụng đã được triển khai thành công!** 