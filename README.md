# 📚 ÔN BÀI CÙNG SPEAK

Ứng dụng web tương tác để ôn bài tiếng Anh với dữ liệu từ file Excel, hỗ trợ nhiều lớp và chủ đề.

## ✨ Tính năng

- 🚀 **Tự động tải dữ liệu** từ GitHub repository
- 📚 **Hỗ trợ nhiều lớp** với URL riêng biệt
- 🎯 **Lọc theo chủ đề** và loại học
- ⌨️ **Phím tắt** tiện lợi (Space: xem đáp án, Enter: câu tiếp theo)
- 📱 **Responsive design** cho mobile và desktop
- 👨‍💼 **Admin panel** để quản lý và tạo link
- 🔗 **Shareable links** cho từng lớp

## 🚀 Cách sử dụng

### 1. Cấu hình GitHub Repository

1. **Upload file Excel** lên GitHub repository của bạn
2. **Cập nhật URL** trong file `config.js`:

```javascript
const CONFIG = {
    GITHUB_EXCEL_URL: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/Uspeak_sample.xlsx',
    // ...
};
```

### 2. Cấu trúc file Excel

File Excel cần có các cột sau:
- **A**: LOP (Lớp)
- **B**: LOAI_HOC (Loại học)
- **C**: CHU_DE (Chủ đề)
- **D**: DE_BAI (Câu hỏi)
- **E**: DAP_AN (Đáp án)

### 3. Triển khai

#### Cách 1: GitHub Pages (Khuyến nghị)
1. Push code lên GitHub repository
2. Vào Settings > Pages
3. Chọn Source: Deploy from a branch
4. Chọn branch `main` và folder `/ (root)`
5. Truy cập: `https://your-username.github.io/your-repo`

#### Cách 2: Local Development
```bash
# Clone repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Mở file index.html trong trình duyệt
# Hoặc sử dụng live server
npx live-server
```

## 📁 Cấu trúc file

```
├── index.html              # Trang chính - nhập mã lớp
├── study.html              # Trang học tập
├── admin.html              # Trang quản lý admin
├── open-all-classes.html   # Trang mở tất cả lớp
├── config.js               # Cấu hình ứng dụng
├── study.js                # Logic trang học tập
├── admin.js                # Logic trang admin
├── open-all-classes.js     # Logic mở tất cả lớp
└── README.md               # Hướng dẫn này
```

## 🎯 Cách sử dụng

### Cho học viên:
1. Truy cập trang chính
2. Nhập mã lớp (VD: TALK TO KID)
3. Upload file Excel hoặc để tự động tải
4. Chọn chủ đề muốn học
5. Bắt đầu ôn bài!

### Cho admin:
1. Truy cập `/admin.html`
2. Upload file Excel
3. Copy link cho từng lớp
4. Chia sẻ link với học viên

### Link trực tiếp:
```
https://your-domain.com/study.html?class=TALK%20TO%20KID
```

## ⚙️ Cấu hình nâng cao

### Thay đổi URL GitHub
Chỉnh sửa file `config.js`:

```javascript
const CONFIG = {
    GITHUB_EXCEL_URL: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/YOUR_FILE.xlsx',
    // ...
};
```

### Thay đổi phím tắt
```javascript
KEYBOARD_SHORTCUTS: {
    SHOW_ANSWER: 'Space',      // Xem đáp án
    NEXT_QUESTION: 'Enter',     // Câu tiếp theo
    PREV_QUESTION: 'ArrowLeft', // Câu trước
    NEXT_CLASS: 'ArrowRight'    // Lớp tiếp theo
}
```

### Thay đổi thông báo
```javascript
ERROR_MESSAGES: {
    FETCH_FAILED: '❌ Không thể tải dữ liệu...',
    // ...
}
```

## 🔧 Troubleshooting

### Lỗi không tải được file từ GitHub
1. Kiểm tra URL trong `config.js`
2. Đảm bảo file Excel đã upload lên GitHub
3. Kiểm tra quyền truy cập file (public)
4. Thử upload file thủ công

### Lỗi CORS
- Sử dụng GitHub Pages hoặc server có CORS headers
- Hoặc upload file thủ công

### Lỗi đọc file Excel
1. Kiểm tra định dạng file (.xlsx)
2. Đảm bảo có đủ 5 cột theo cấu trúc
3. Kiểm tra encoding (UTF-8)

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra Console trong Developer Tools
2. Xem log lỗi trong terminal
3. Tạo issue trên GitHub repository

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**Made with ❤️ for better English learning!** 