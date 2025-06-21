// Biến toàn cục
let allData = [];
let classData = {}; // Dữ liệu theo lớp
let currentClass = null;
let filteredData = [];
let currentQuestion = null;

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Xử lý sự kiện chọn file
    const fileInput = document.getElementById('excelFile');
    fileInput.addEventListener('change', handleFileSelect);
    
    // Xử lý sự kiện nút
    document.getElementById('showAnswer').addEventListener('click', showAnswer);
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    
    // Kiểm tra URL parameters khi khởi tạo
    checkUrlParameters();
}

function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const classParam = urlParams.get('class');
    
    if (classParam) {
        // Lưu tên lớp từ URL để sử dụng sau khi load file
        window.preSelectedClass = decodeURIComponent(classParam);
        console.log('Lớp được chọn từ URL:', window.preSelectedClass);
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Xử lý tất cả sheet
            allData = [];
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                // Bỏ qua hàng đầu tiên (header)
                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (row.length >= 5) {
                        allData.push({
                            LOP: row[0] || '',
                            LOAI_HOC: row[1] || '',
                            CHU_DE: row[2] || '',
                            DE_BAI: row[3] || '',
                            DAP_AN: row[4] || '',
                            SHEET: sheetName
                        });
                    }
                }
            });
            
            // Lọc bỏ dữ liệu rỗng
            allData = allData.filter(item => 
                item.DE_BAI && item.DE_BAI.trim() !== '' && 
                item.CHU_DE && item.CHU_DE.trim() !== ''
            );
            
            if (allData.length > 0) {
                organizeDataByClass();
                showClassSelection();
                
                // Tự động chọn lớp từ URL nếu có
                if (window.preSelectedClass) {
                    autoSelectClassFromUrl();
                }
            } else {
                alert('Không tìm thấy dữ liệu hợp lệ trong file Excel!');
            }
            
        } catch (error) {
            console.error('Lỗi khi đọc file Excel:', error);
            alert('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại file!');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function autoSelectClassFromUrl() {
    const targetClass = window.preSelectedClass;
    const availableClasses = Object.keys(classData);
    
    // Tìm lớp phù hợp (có thể không chính xác 100% do encoding)
    const matchedClass = availableClasses.find(className => 
        className.toLowerCase().includes(targetClass.toLowerCase()) ||
        targetClass.toLowerCase().includes(className.toLowerCase())
    );
    
    if (matchedClass) {
        selectClass(matchedClass);
        console.log('Đã tự động chọn lớp:', matchedClass);
        
        // Hiển thị thông báo
        showNotification(`Đã tự động chọn lớp: ${matchedClass}`, 'success');
    } else {
        console.log('Không tìm thấy lớp phù hợp:', targetClass);
        showNotification(`Không tìm thấy lớp: ${targetClass}`, 'warning');
    }
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

function organizeDataByClass() {
    // Tổ chức dữ liệu theo lớp
    classData = {};
    
    allData.forEach(item => {
        const className = item.LOP || 'Không phân lớp';
        if (!classData[className]) {
            classData[className] = [];
        }
        classData[className].push(item);
    });
    
    console.log('Dữ liệu theo lớp:', classData);
}

function showClassSelection() {
    const classTabs = document.getElementById('classTabs');
    classTabs.innerHTML = '';
    
    Object.keys(classData).forEach(className => {
        const classCount = classData[className].length;
        const tab = document.createElement('div');
        tab.className = 'class-tab';
        tab.innerHTML = `
            ${className}
            <span class="count">(${classCount})</span>
        `;
        
        tab.addEventListener('click', () => selectClass(className));
        classTabs.appendChild(tab);
    });
    
    // Hiển thị phần chọn lớp
    document.getElementById('classSelector').style.display = 'block';
    
    // Tự động chọn lớp đầu tiên nếu không có lớp từ URL
    if (!window.preSelectedClass) {
        const firstClass = Object.keys(classData)[0];
        if (firstClass) {
            selectClass(firstClass);
        }
    }
}

function selectClass(className) {
    currentClass = className;
    
    // Cập nhật URL
    updateUrlForClass(className);
    
    // Cập nhật UI cho class tabs
    document.querySelectorAll('.class-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.includes(className)) {
            tab.classList.add('active');
        }
    });
    
    // Hiển thị thông tin lớp hiện tại
    document.getElementById('currentClassName').textContent = `Lớp: ${className}`;
    document.getElementById('currentClassInfo').style.display = 'block';
    
    // Hiển thị chọn chủ đề cho lớp này
    showTopicSelectionForClass();
}

function updateUrlForClass(className) {
    const url = new URL(window.location);
    url.searchParams.set('class', className);
    window.history.replaceState({}, '', url);
}

function showTopicSelectionForClass() {
    if (!currentClass || !classData[currentClass]) return;
    
    const classQuestions = classData[currentClass];
    
    // Lấy danh sách chủ đề duy nhất cho lớp này
    const topics = [...new Set(classQuestions.map(item => item.CHU_DE).filter(Boolean))];
    
    const topicList = document.getElementById('topicList');
    topicList.innerHTML = '';
    
    topics.forEach(topic => {
        const label = document.createElement('label');
        label.className = 'topic-checkbox';
        label.innerHTML = `
            <input type="checkbox" value="${topic}" checked>
            ${topic}
        `;
        topicList.appendChild(label);
    });
    
    // Hiển thị phần chọn chủ đề
    document.getElementById('topicSelect').style.display = 'block';
    document.getElementById('questionBox').style.display = 'block';
    
    // Thêm event listener cho checkbox
    const checkboxes = topicList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateFilteredData);
    });
    
    // Khởi tạo dữ liệu đã lọc
    updateFilteredData();
}

function updateFilteredData() {
    if (!currentClass || !classData[currentClass]) return;
    
    const selectedTopics = Array.from(
        document.querySelectorAll('#topicList input[type="checkbox"]:checked')
    ).map(cb => cb.value);
    
    // Lọc dữ liệu theo lớp hiện tại và chủ đề đã chọn
    filteredData = classData[currentClass].filter(item => 
        selectedTopics.includes(item.CHU_DE)
    );
    
    if (filteredData.length === 0) {
        document.getElementById('questionText').innerText = 'Hãy chọn ít nhất 1 chủ đề!';
        document.getElementById('answerText').style.display = 'none';
    } else {
        nextQuestion();
    }
}

function nextQuestion() {
    if (filteredData.length === 0) {
        document.getElementById('questionText').innerText = 'Hãy chọn ít nhất 1 chủ đề!';
        document.getElementById('answerText').style.display = 'none';
        return;
    }
    
    // Chọn câu hỏi ngẫu nhiên
    const randomIndex = Math.floor(Math.random() * filteredData.length);
    currentQuestion = filteredData[randomIndex];
    
    // Hiển thị câu hỏi
    document.getElementById('questionText').innerText = currentQuestion.DE_BAI;
    
    // Ẩn đáp án
    const answerElement = document.getElementById('answerText');
    answerElement.style.display = 'none';
    answerElement.innerText = currentQuestion.DAP_AN || 'Không có đáp án';
}

function showAnswer() {
    if (currentQuestion) {
        document.getElementById('answerText').style.display = 'block';
    }
}

// Thêm tính năng bổ sung
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Phím Space để xem đáp án
        if (event.code === 'Space' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            showAnswer();
        }
        
        // Phím Enter để câu tiếp theo
        if (event.code === 'Enter' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            nextQuestion();
        }
        
        // Phím mũi tên trái/phải để chuyển lớp
        if (event.code === 'ArrowLeft' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            switchToPreviousClass();
        }
        
        if (event.code === 'ArrowRight' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            switchToNextClass();
        }
    });
}

function switchToPreviousClass() {
    if (!currentClass) return;
    
    const classes = Object.keys(classData);
    const currentIndex = classes.indexOf(currentClass);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : classes.length - 1;
    
    selectClass(classes[previousIndex]);
}

function switchToNextClass() {
    if (!currentClass) return;
    
    const classes = Object.keys(classData);
    const currentIndex = classes.indexOf(currentClass);
    const nextIndex = currentIndex < classes.length - 1 ? currentIndex + 1 : 0;
    
    selectClass(classes[nextIndex]);
}

// Thêm tooltip cho phím tắt
function addTooltips() {
    const showAnswerBtn = document.getElementById('showAnswer');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    
    showAnswerBtn.title = 'Phím tắt: Space';
    nextQuestionBtn.title = 'Phím tắt: Enter';
}

// Khởi tạo các tính năng bổ sung
addKeyboardShortcuts();
addTooltips(); 