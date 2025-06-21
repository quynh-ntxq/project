// Biến toàn cục
let allData = [];
let classData = {};
let selectedClasses = new Set();

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    initializeOpenAllClasses();
});

function initializeOpenAllClasses() {
    // Xử lý sự kiện chọn file
    const fileInput = document.getElementById('excelFile');
    fileInput.addEventListener('change', handleFileSelect);
    
    // Xử lý sự kiện nút mở tất cả
    const openAllBtn = document.getElementById('openAllBtn');
    openAllBtn.addEventListener('click', openAllClasses);
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    updateFileInfo(file);
    readExcelFile(file);
}

function readExcelFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
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
            alert('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại file.');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

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

function displayClassList() {
    const classList = document.getElementById('classList');
    
    if (Object.keys(classData).length === 0) {
        classList.innerHTML = '<div class="no-data">Không tìm thấy dữ liệu lớp nào</div>';
        return;
    }
    
    classList.innerHTML = '';
    
    Object.values(classData).forEach(classInfo => {
        const classItem = document.createElement('div');
        classItem.className = 'class-item';
        classItem.dataset.className = classInfo.name;
        
        classItem.innerHTML = `
            <div class="class-name">${classInfo.name}</div>
            <div class="class-count">${classInfo.questions.length} câu hỏi</div>
        `;
        
        classItem.addEventListener('click', () => toggleClassSelection(classInfo.name, classItem));
        classList.appendChild(classItem);
    });
    
    // Kích hoạt các nút
    document.getElementById('openAllBtn').disabled = false;
    document.getElementById('selectAllBtn').disabled = false;
    document.getElementById('deselectAllBtn').disabled = false;
}

function toggleClassSelection(className, element) {
    if (selectedClasses.has(className)) {
        selectedClasses.delete(className);
        element.classList.remove('selected');
    } else {
        selectedClasses.add(className);
        element.classList.add('selected');
    }
    
    updateOpenAllButton();
}

function selectAllClasses() {
    selectedClasses.clear();
    const classItems = document.querySelectorAll('.class-item');
    
    classItems.forEach(item => {
        const className = item.dataset.className;
        selectedClasses.add(className);
        item.classList.add('selected');
    });
    
    updateOpenAllButton();
}

function deselectAllClasses() {
    selectedClasses.clear();
    const classItems = document.querySelectorAll('.class-item');
    
    classItems.forEach(item => {
        item.classList.remove('selected');
    });
    
    updateOpenAllButton();
}

function updateOpenAllButton() {
    const openAllBtn = document.getElementById('openAllBtn');
    if (selectedClasses.size > 0) {
        openAllBtn.textContent = `🚀 Mở ${selectedClasses.size} lớp`;
        openAllBtn.disabled = false;
    } else {
        openAllBtn.textContent = '🚀 Mở tất cả lớp';
        openAllBtn.disabled = true;
    }
}

function openAllClasses() {
    if (selectedClasses.size === 0) {
        alert('Vui lòng chọn ít nhất một lớp!');
        return;
    }
    
    const classesToOpen = selectedClasses.size > 0 ? Array.from(selectedClasses) : Object.keys(classData);
    
    classesToOpen.forEach(className => {
        const studyUrl = `study.html?class=${encodeURIComponent(className)}`;
        window.open(studyUrl, '_blank');
    });
    
    // Hiển thị thông báo
    const message = selectedClasses.size > 0 
        ? `Đã mở ${selectedClasses.size} lớp trong các tab mới!`
        : `Đã mở tất cả ${classesToOpen.length} lớp trong các tab mới!`;
    
    alert(message);
}

function updateFileInfo(file) {
    const fileInfo = document.getElementById('fileInfo');
    fileInfo.textContent = `📁 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
}

// Thêm tính năng copy link cho từng lớp
function copyClassLink(className) {
    const url = `${window.location.origin}${window.location.pathname.replace('open-all-classes.html', 'index.html')}?class=${encodeURIComponent(className)}`;
    
    navigator.clipboard.writeText(url).then(() => {
        // Hiển thị thông báo
        showNotification(`Đã copy link cho lớp: ${className}`, 'success');
    }).catch(err => {
        console.error('Lỗi khi copy:', err);
        showNotification('Lỗi khi copy link!', 'error');
    });
}

function showNotification(message, type = 'info') {
    // Tạo notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Màu sắc theo loại
    if (type === 'success') {
        notification.style.background = '#27ae60';
    } else if (type === 'warning') {
        notification.style.background = '#f39c12';
    } else if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else {
        notification.style.background = '#3498db';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Thêm CSS cho animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 