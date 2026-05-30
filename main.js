// --- 육십갑자(간지) 계산 유틸리티 ---
function getZodiacYear(year) {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 기준점인 4년(갑자년은 아니지만 계산용 오프셋)을 기준으로 차이 계산
  let offset = year - 4;
  if (offset < 0) {
    offset = 60 + (offset % 60);
  }
  
  const stem = stems[offset % 10];
  const branch = branches[offset % 12];
  
  return `(${stem}${branch}年)`;
}

// --- 요일 한자 변환 ---
const weekMap = ['日', '月', '火', '水', '木', '金', '土'];

// 요일에 따른 캘린더 테마 컬러 기본값 (실제 일력 감성)
const dayColors = {
  0: '#d9534f', // 일요일: 빈티지 빨강
  6: '#4a90e2', // 토요일: 빈티지 파랑
  default: '#98c9a3' // 평일: 기본 지정색 (사용자 설정 적용 가능)
};

// --- DOM 요소 참조 ---
const inputDate = document.getElementById('input-date');
const inputText = document.getElementById('input-text');
const colorTheme = document.getElementById('color-theme');
const colorHex = document.querySelector('.color-hex');
const fontNumber = document.getElementById('font-number');
const fontText = document.getElementById('font-text');
const sizeNumber = document.getElementById('size-number');
const sizeText = document.getElementById('size-text');
const toggleTexture = document.getElementById('toggle-texture');
const toggleRip = document.getElementById('toggle-rip');

const calendarCard = document.getElementById('calendar-card');
const calendarBand = document.getElementById('calendar-band');
const displayMonth = document.getElementById('display-month');
const displayYear = document.getElementById('display-year');
const displayZodiac = document.getElementById('display-zodiac');
const displayDayOfWeek = document.getElementById('display-day-of-week');
const displayDay = document.getElementById('display-day');
const displayCustomText = document.getElementById('display-custom-text');

// --- 화면 업데이트 함수 ---
function updateCalendar() {
  const dateVal = inputDate.value;
  if (!dateVal) return;

  const date = new Date(dateVal);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0: 일요일, 6: 토요일

  // 1. 날짜 및 텍스트 업데이트
  displayYear.textContent = `${year}年`;
  displayZodiac.textContent = getZodiacYear(year);
  displayMonth.textContent = `${month}月`;
  displayDayOfWeek.textContent = weekMap[dayOfWeek];
  displayDay.textContent = day;
  displayCustomText.textContent = inputText.value;

  // 2. 요일에 따른 상단 띠 배경색 테마 자동 업데이트
  let activeColor = colorTheme.value;
  if (dayOfWeek === 0) {
    // 일요일은 빨간색 테마
    activeColor = '#d9534f';
  } else if (dayOfWeek === 6) {
    // 토요일은 파란색 테마
    activeColor = '#4a90e2';
  }
  
  // CSS 변수 적용
  document.documentElement.style.setProperty('--calendar-theme-color', activeColor);
  
  // 색상 선택 도구 값도 요일에 맞게 임시 표시 (단, 비활성화된 것은 아니며 평일색을 변경할 수 있도록 유지)
  if (dayOfWeek !== 0 && dayOfWeek !== 6) {
    colorHex.textContent = colorTheme.value.toUpperCase();
  } else {
    colorHex.textContent = `${activeColor.toUpperCase()} (자동)`;
  }
}

// --- 스타일 실시간 동기화 설정 ---
function setupStyleListeners() {
  // 상단 띠 색상 변경
  colorTheme.addEventListener('input', (e) => {
    colorHex.textContent = e.target.value.toUpperCase();
    const date = new Date(inputDate.value);
    const dayOfWeek = date.getDay();
    // 평일일 때만 즉시 반영
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      document.documentElement.style.setProperty('--calendar-theme-color', e.target.value);
    }
  });

  // 폰트 종류 변경
  fontNumber.addEventListener('change', (e) => {
    document.documentElement.style.setProperty('--calendar-num-font', e.target.value);
  });
  fontText.addEventListener('change', (e) => {
    document.documentElement.style.setProperty('--calendar-text-font', e.target.value);
  });

  // 크기 변경
  sizeNumber.addEventListener('input', (e) => {
    // cqw 단위를 기준으로 조절하도록 설정
    const cqwVal = (e.target.value / 6).toFixed(1) + 'cqw';
    document.documentElement.style.setProperty('--calendar-num-size', cqwVal);
  });
  sizeText.addEventListener('input', (e) => {
    const cqwVal = (e.target.value / 5).toFixed(1) + 'cqw';
    document.documentElement.style.setProperty('--calendar-text-size', cqwVal);
  });

  // 종이 질감 토글
  toggleTexture.addEventListener('change', (e) => {
    if (e.target.checked) {
      calendarCard.classList.remove('no-texture');
    } else {
      calendarCard.classList.add('no-texture');
    }
  });

  // 찢어진 상단 효과 토글
  toggleRip.addEventListener('change', (e) => {
    if (e.target.checked) {
      calendarCard.classList.remove('no-rip');
    } else {
      calendarCard.classList.add('no-rip');
    }
  });

  // 입력 감지
  inputDate.addEventListener('change', updateCalendar);
  inputText.addEventListener('input', updateCalendar);
}

// --- 내보내기 기능 구현 ---

// 1. 브라우저 인쇄
document.getElementById('btn-print').addEventListener('click', () => {
  window.print();
});

// 2. PDF 다운로드 (html2pdf)
document.getElementById('btn-pdf').addEventListener('click', () => {
  const element = document.getElementById('calendar-card');
  const dateVal = inputDate.value || 'calendar';
  
  // A4 비율 맞춤형 고해상도 옵션 설정
  const opt = {
    margin: 0,
    filename: `일력-${dateVal}.pdf`,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { 
      scale: 3, // 해상도 대폭 업
      useCORS: true,
      letterRendering: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  // 진행 중임을 보여주기 위해 임시 버튼 상태 변경
  const btn = document.getElementById('btn-pdf');
  const originalText = btn.innerHTML;
  btn.innerHTML = '⌛ PDF 생성 중...';
  btn.disabled = true;

  html2pdf().set(opt).from(element).save().then(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }).catch(err => {
    console.error(err);
    alert('PDF 생성 중 오류가 발생했습니다.');
    btn.innerHTML = originalText;
    btn.disabled = false;
  });
});

// 3. PNG 이미지 다운로드 (html2canvas)
document.getElementById('btn-image').addEventListener('click', () => {
  const element = document.getElementById('calendar-card');
  const dateVal = inputDate.value || 'calendar';

  const btn = document.getElementById('btn-image');
  const originalText = btn.innerHTML;
  btn.innerHTML = '⌛ 이미지 저장 중...';
  btn.disabled = true;

  // html2canvas로 고화질 촬영
  html2canvas(element, {
    scale: 3, // 고해상도
    useCORS: true,
    backgroundColor: null // 투명 배경 유지
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `일력-${dateVal}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    btn.innerHTML = originalText;
    btn.disabled = false;
  }).catch(err => {
    console.error(err);
    alert('이미지 생성 중 오류가 발생했습니다.');
    btn.innerHTML = originalText;
    btn.disabled = false;
  });
});

// --- 초기화 구동 ---
function init() {
  setupStyleListeners();
  
  // 크기 슬라이더 값에 대응하는 기본 CSS 변수값 초기 설정
  const numCqw = (sizeNumber.value / 6).toFixed(1) + 'cqw';
  const textCqw = (sizeText.value / 5).toFixed(1) + 'cqw';
  document.documentElement.style.setProperty('--calendar-num-size', numCqw);
  document.documentElement.style.setProperty('--calendar-text-size', textCqw);
  
  // 첫 화면 로드
  updateCalendar();
}

// 모듈 스크립트이므로 바로 실행
init();
