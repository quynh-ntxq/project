// Biến toàn cục
let allData = [];
let classData = {};

// Khởi tạo trang
function initPage() {
    // Tự động tải file Excel từ GitHub
    autoLoadExcelFile();
}

// Tự động tải file Excel từ GitHub
async function autoLoadExcelFile() {
    try {
        // URL của file Excel trên GitHub (thay đổi theo repository của bạn)
        const excelUrl = 'https://raw.githubusercontent.com/your-username/your-repo/main/Uspeak_sample.xlsx';
        
        // Hiển thị loading
        document.getElementById('fileInfo').textContent = '🔄 Đang tải dữ liệu từ GitHub...';
        document.getElementById('classList').innerHTML = '<div class="loading">🔄 Đang tải dữ liệu...</div>';
        
        // Tải file từ GitHub
        const response = await fetch(excelUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        
        // Đọc file Excel
        readExcelData(data);
        
        // Cập nhật thông tin file
        document.getElementById('fileInfo').textContent = '✅ Dữ liệu đã tải từ GitHub';
        
    } catch (error) {
        console.error('Lỗi khi tải file từ GitHub:', error);
        document.getElementById('fileInfo').textContent = '❌ Không thể tải từ GitHub. Vui lòng upload file thủ công.';
        document.getElementById('classList').innerHTML = '<div class="no-data">Vui lòng upload file Excel để xem danh sách lớp</div>';
    }
}

// Đọc dữ liệu Excel từ ArrayBuffer
function readExcelData(data) {
    try {
        const workbook = XLSX.read(data, { type: 'array' });
        
        allData = [];
        
        // Đọc tất cả các sheet
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length > 1) {
                const headers = jsonData[0];
                const rows = jsonData.slice(1);
                
                rows.forEach(row => {
                    if (row.length >= 5) {
                        const item = {
                            LOP: row[0] || '',
                            LOAI_HOC: row[1] || '',
                            CHU_DE: row[2] || '',
                            DE_BAI: row[3] || '',
                            DAP_AN: row[4] || '',
                            SHEET: sheetName
                        };
                        allData.push(item);
                    }
                });
            }
        });
        
        console.log('Dữ liệu đã đọc:', allData);
        processClassData();
        
    } catch (error) {
        console.error('Lỗi khi đọc file Excel:', error);
        document.getElementById('fileInfo').textContent = '❌ Lỗi khi đọc file Excel. Vui lòng thử lại.';
    }
}

// Đọc file Excel từ upload thủ công
function readExcelFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        readExcelData(data);
        updateFileInfo(file);
    };
    
    reader.readAsArrayBuffer(file);
}

// Xử lý dữ liệu theo lớp
function processClassData() {
    classData = {};
    
    allData.forEach(item => {
        if (item.LOP) {
            const className = item.LOP.toString().trim();
            if (!classData[className]) {
                classData[className] = {
                    name: className,
                    questions: [],
                    topics: new Set(),
                    types: new Set()
                };
            }
            
            classData[className].questions.push(item);
            if (item.CHU_DE) classData[className].topics.add(item.CHU_DE);
            if (item.LOAI_HOC) classData[className].types.add(item.LOAI_HOC);
        }
    });
    
    console.log('Dữ liệu đã xử lý theo lớp:', classData);
    displayClassList();
}

// Hiển thị danh sách lớp
function displayClassList() {
    const classList = document.getElementById('classList');
    
    if (Object.keys(classData).length === 0) {
        classList.innerHTML = '<div class="no-data">Không tìm thấy dữ liệu lớp nào</div>';
        return;
    }
    
    classList.innerHTML = '';
    
    Object.values(classData).forEach(classInfo => {
        const classCard = document.createElement('div');
        classCard.className = 'class-card';
        
        const topics = Array.from(classInfo.topics).join(', ');
        const types = Array.from(classInfo.types).join(', ');
        
        const studyUrl = `study.html?class=${encodeURIComponent(classInfo.name)}`;
        
        classCard.innerHTML = `
            <div class="class-name">${classInfo.name}</div>
            <div class="class-stats">
                📝 ${classInfo.questions.length} câu hỏi<br>
                📚 Chủ đề: ${topics || 'Không có'}<br>
                🏷️ Loại: ${types || 'Không có'}
            </div>
            <a href="${studyUrl}" class="class-link" target="_blank">
                🚀 Vào lớp học
            </a>
            <button class="copy-btn" onclick="copyLink('${studyUrl}', this)">
                📋 Copy link
            </button>
            <button class="export-btn" onclick="exportClassData('${classInfo.name}')">
                📊 Export Excel
            </button>
        `;
        
        classList.appendChild(classCard);
    });
}

// Copy link
function copyLink(url, button) {
    const fullUrl = window.location.origin + window.location.pathname.replace('admin.html', '') + url;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
        const originalText = button.textContent;
        button.textContent = '✅ Đã copy!';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#f39c12';
        }, 2000);
    }).catch(err => {
        console.error('Lỗi khi copy:', err);
        alert('Không thể copy link. Vui lòng thử lại.');
    });
}

// Export dữ liệu lớp
function exportClassData(className) {
    const classInfo = classData[className];
    if (!classInfo) return;
    
    // Tạo workbook mới
    const wb = XLSX.utils.book_new();
    
    // Chuẩn bị dữ liệu
    const exportData = classInfo.questions.map(item => [
        item.LOP,
        item.LOAI_HOC,
        item.CHU_DE,
        item.DE_BAI,
        item.DAP_AN
    ]);
    
    // Thêm header
    exportData.unshift(['LOP', 'LOAI_HOC', 'CHU_DE', 'DE_BAI', 'DAP_AN']);
    
    // Tạo worksheet
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    
    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, className);
    
    // Tải file
    XLSX.writeFile(wb, `${className}_data.xlsx`);
}

// Cập nhật thông tin file
function updateFileInfo(file) {
    const fileInfo = document.getElementById('fileInfo');
    fileInfo.textContent = `📁 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
}

// Xử lý sự kiện
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    
    // File upload (dự phòng)
    document.getElementById('excelFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            readExcelFile(file);
        }
    });
}); 