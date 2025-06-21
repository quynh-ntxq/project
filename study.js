// Biến toàn cục
let allData = [];
let currentClass = '';
let currentTopics = [];
let filteredData = [];
let currentQuestionIndex = -1;

// Lấy tham số từ URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Quay lại trang chính
function goBack() {
    window.location.href = 'index.html';
}

// Khởi tạo trang
function initPage() {
    currentClass = getUrlParameter('class') || '';
    
    if (currentClass) {
        document.getElementById('currentClassName').textContent = `Lớp: ${currentClass}`;
        document.getElementById('currentClassInfo').style.display = 'block';
        document.getElementById('headerTitle').textContent = `${currentClass} - ÔN BÀI CÙNG SPEAK`;
    }
    
    // Tự động tải file Excel từ GitHub
    autoLoadExcelFile();
}

// Tự động tải file Excel từ GitHub
async function autoLoadExcelFile() {
    try {
        // Sử dụng URL từ config
        const excelUrl = getAutoGitHubUrl();
        
        // Hiển thị loading
        document.getElementById('questionText').textContent = '🔄 Đang tải dữ liệu...';
        document.getElementById('questionBox').style.display = 'block';
        
        // Tạo controller để timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);
        
        // Tải file từ GitHub
        const response = await fetch(excelUrl, { 
            signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        
        // Đọc file Excel
        readExcelData(data);
        
    } catch (error) {
        console.error('Lỗi khi tải file từ GitHub:', error);
        
        if (error.name === 'AbortError') {
            document.getElementById('questionText').textContent = getErrorMessage('FETCH_FAILED');
        } else {
            document.getElementById('questionText').textContent = getErrorMessage('FETCH_FAILED');
        }
        
        // Hiển thị lại phần upload thủ công
        document.querySelector('.file-upload').style.display = 'block';
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
        filterDataByClass();
        
    } catch (error) {
        console.error('Lỗi khi đọc file Excel:', error);
        document.getElementById('questionText').textContent = getErrorMessage('EXCEL_READ_ERROR');
    }
}

// Đọc file Excel từ upload thủ công
function readExcelFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        readExcelData(data);
    };
    
    reader.readAsArrayBuffer(file);
}

// Lọc dữ liệu theo lớp
function filterDataByClass() {
    if (!currentClass) {
        filteredData = allData;
    } else {
        filteredData = allData.filter(item => 
            item.LOP && item.LOP.toString().toUpperCase().includes(currentClass.toUpperCase())
        );
    }
    
    console.log('Dữ liệu đã lọc theo lớp:', filteredData);
    
    if (filteredData.length > 0) {
        updateTopicList();
        showQuestionBox();
        getRandomQuestion();
    } else {
        document.getElementById('questionText').textContent = getErrorMessage('NO_CLASS_DATA');
    }
}

// Cập nhật danh sách chủ đề
function updateTopicList() {
    const topics = [...new Set(filteredData.map(item => item.CHU_DE).filter(topic => topic))];
    const topicList = document.getElementById('topicList');
    const topicSelect = document.getElementById('topicSelect');
    
    if (topics.length > 0) {
        topicList.innerHTML = '';
        topics.forEach(topic => {
            const label = document.createElement('label');
            label.className = 'topic-checkbox';
            label.innerHTML = `
                <input type="checkbox" value="${topic}" checked>
                ${topic}
            `;
            label.addEventListener('change', filterByTopics);
            topicList.appendChild(label);
        });
        
        topicSelect.style.display = 'block';
        currentTopics = topics;
        filterByTopics();
    } else {
        topicSelect.style.display = 'none';
        currentTopics = [];
        getRandomQuestion();
    }
}

// Lọc theo chủ đề
function filterByTopics() {
    const selectedTopics = Array.from(document.querySelectorAll('#topicList input:checked'))
        .map(input => input.value);
    
    if (selectedTopics.length > 0) {
        const filtered = filteredData.filter(item => 
            selectedTopics.includes(item.CHU_DE)
        );
        if (filtered.length > 0) {
            filteredData = filtered;
            getRandomQuestion();
        }
    } else {
        // Nếu không chọn chủ đề nào, hiển thị tất cả
        filterDataByClass();
    }
}

// Hiển thị hộp câu hỏi
function showQuestionBox() {
    document.getElementById('questionBox').style.display = 'block';
}

// Lấy câu hỏi ngẫu nhiên
function getRandomQuestion() {
    if (filteredData.length === 0) {
        document.getElementById('questionText').textContent = getErrorMessage('NO_QUESTIONS');
        return;
    }
    
    currentQuestionIndex = Math.floor(Math.random() * filteredData.length);
    const question = filteredData[currentQuestionIndex];
    
    document.getElementById('questionText').textContent = question.DE_BAI || 'Không có câu hỏi';
    document.getElementById('answerText').textContent = '';
    document.getElementById('answerText').style.display = 'none';
    document.getElementById('showAnswer').disabled = false;
}

// Hiển thị đáp án
function showAnswer() {
    if (currentQuestionIndex >= 0 && filteredData[currentQuestionIndex]) {
        const answer = filteredData[currentQuestionIndex].DAP_AN || 'Không có đáp án';
        document.getElementById('answerText').textContent = answer;
        document.getElementById('answerText').style.display = 'block';
        document.getElementById('showAnswer').disabled = true;
    }
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
    
    // Nút hiển thị đáp án
    document.getElementById('showAnswer').addEventListener('click', showAnswer);
    
    // Nút câu tiếp theo
    document.getElementById('nextQuestion').addEventListener('click', getRandomQuestion);
    
    // Phím tắt
    document.addEventListener('keydown', function(e) {
        if (e.code === CONFIG.KEYBOARD_SHORTCUTS.SHOW_ANSWER) {
            e.preventDefault();
            showAnswer();
        } else if (e.code === CONFIG.KEYBOARD_SHORTCUTS.NEXT_QUESTION) {
            e.preventDefault();
            getRandomQuestion();
        }
    });
}); 