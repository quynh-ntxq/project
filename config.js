// Cấu hình ứng dụng
const CONFIG = {
    // URL của file Excel trên GitHub (thay đổi theo repository của bạn)
    GITHUB_EXCEL_URL: 'https://raw.githubusercontent.com/quynh-ntxq/project/main/Uspeak_sample.xlsx',
    
    // Tên file Excel mặc định
    DEFAULT_EXCEL_FILENAME: 'Uspeak_sample.xlsx',
    
    // Thời gian timeout khi tải file (ms)
    FETCH_TIMEOUT: 10000,
    
    // Cấu hình hiển thị
    DISPLAY: {
        // Số câu hỏi tối đa hiển thị trong một lần
        MAX_QUESTIONS_PER_PAGE: 1,
        
        // Thời gian delay giữa các câu hỏi (ms)
        QUESTION_DELAY: 500,
        
        // Hiển thị loading khi tải dữ liệu
        SHOW_LOADING: true
    },
    
    // Cấu hình phím tắt
    KEYBOARD_SHORTCUTS: {
        SHOW_ANSWER: 'Space',
        NEXT_QUESTION: 'Enter',
        PREV_QUESTION: 'ArrowLeft',
        NEXT_CLASS: 'ArrowRight'
    },
    
    // Cấu hình lỗi
    ERROR_MESSAGES: {
        FETCH_FAILED: '❌ Không thể tải dữ liệu từ GitHub. Vui lòng kiểm tra kết nối internet.',
        EXCEL_READ_ERROR: '❌ Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file.',
        NO_CLASS_DATA: '❌ Không tìm thấy dữ liệu cho lớp này.',
        NO_QUESTIONS: '❌ Không có câu hỏi nào trong dữ liệu.'
    },
    
    // Cấu hình thành công
    SUCCESS_MESSAGES: {
        DATA_LOADED: '✅ Dữ liệu đã tải thành công!',
        LINK_COPIED: '✅ Đã copy link vào clipboard!',
        FILE_EXPORTED: '✅ Đã export file Excel!'
    }
};

// Hàm lấy URL GitHub từ config
function getGitHubExcelUrl() {
    return CONFIG.GITHUB_EXCEL_URL;
}

// Hàm lấy thông báo lỗi
function getErrorMessage(key) {
    return CONFIG.ERROR_MESSAGES[key] || '❌ Đã xảy ra lỗi không xác định.';
}

// Hàm lấy thông báo thành công
function getSuccessMessage(key) {
    return CONFIG.SUCCESS_MESSAGES[key] || '✅ Thao tác thành công!';
}

// Hàm kiểm tra xem có đang ở localhost không
function isLocalhost() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '';
}

// Hàm tạo URL GitHub tự động dựa trên domain hiện tại
function getAutoGitHubUrl() {
    if (isLocalhost()) {
        // Nếu đang ở localhost, sử dụng URL mặc định
        return CONFIG.GITHUB_EXCEL_URL;
    } else {
        // Nếu đang ở production, có thể thay đổi URL
        const currentDomain = window.location.hostname;
        if (currentDomain.includes('github.io')) {
            // Nếu đang host trên GitHub Pages
            const repoName = window.location.pathname.split('/')[1];
            return `https://raw.githubusercontent.com/your-username/${repoName}/main/${CONFIG.DEFAULT_EXCEL_FILENAME}`;
        }
        return CONFIG.GITHUB_EXCEL_URL;
    }
}

// Export để sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getGitHubExcelUrl, getErrorMessage, getSuccessMessage, getAutoGitHubUrl };
} 
