const CONFIG = {
    ko: { 
        label: "한국어", 
        flag: "https://flagcdn.com/w40/kr.png", 
        title: "사무엘힐커뮤니티 소식지 <br class='mobile-only'> < 갈릴리 이야기 >", 
        imgPrefix: "images/magazine/galilee", 
        count: 17, 
        footerTitle:"사무엘힐커뮤니티",
        copyrightName:"사무엘힐커뮤니티",
        footer: "전화 : 054-533-1907 │ 팩스 : 054-533-1908 <br class='mobile-only'> │ 주소 : 37141 경북 상주시 화남면 원정소곡로 629" 
    },
    en: { 
        label: "English", 
        flag: "https://flagcdn.com/w40/us.png", 
        title: "Samuel Community Newsletter <br class='mobile-only'> < Galilee Story >", 
        imgPrefix: "images/magazine_en/galilee_en", 
        count: 17, 
        footerTitle:"SAMUELHILL COMMUNITY",
        copyrightName:"SAMUELHILL COMMUNITY",
        footer: "Tel: +82-54-533-1907 <br class='mobile-only'> | Addr: 629, Wonjeongsogok-ro, Sangju-si, Gyeongbuk" 
    }
};

let swiper1, swiper2, modalSwiper;

// 통합 박스 토글 기능
function toggleLangMenu() {
    document.getElementById('langSelector').classList.toggle('open');
}

function selectLanguage(lang, event) {
    if (event) event.stopPropagation(); // 부모 토글 이벤트 방지
    
    const data = CONFIG[lang];
    
    // 1. 닫혔을 때 보여줄 텍스트와 국기 업데이트
    document.getElementById('display-flag').src = data.flag;
    document.getElementById('display-text').innerText = data.label;
    
    // 2. 리스트 내 현재 언어 진하게 표시
    document.querySelectorAll('.lang-item').forEach(item => item.classList.remove('active'));
    document.getElementById(`item-${lang}`).classList.add('active');
    
    // 3. 메뉴 닫기
    document.getElementById('langSelector').classList.remove('open');
    
    renderContent(lang);
    initSwipers();
}

// 외부 클릭 시 메뉴 닫기
window.addEventListener('click', e => {
    if (!e.target.closest('#langSelector')) {
        document.getElementById('langSelector').classList.remove('open');
    }
});

function renderContent(lang) {
    const data = CONFIG[lang];
    document.getElementById('mag-title').innerHTML = data.title;
    document.getElementById('footer-text').innerHTML = data.footer;
    if(document.getElementById('footer-logo-text')) {
        document.getElementById('footer-logo-text').innerText = data.footerTitle;
    }
    if(document.getElementById('copyright-name')) {
        document.getElementById('copyright-name').innerText = data.copyrightName;
    }
    document.querySelectorAll('.link-label').forEach(el => el.innerHTML = el.getAttribute(`data-${lang}`));

    let mainHtml = '', thumbHtml = '', modalHtml = '';
    for (let i = 1; i <= data.count; i++) {
        const src = `${data.imgPrefix}${i}.jpg`, fb = `images/magazine/galilee${i}.jpg`;
        mainHtml += `<div class="swiper-slide"><img src="${src}" onerror="this.src='${fb}'"></div>`;
        thumbHtml += `<div class="swiper-slide"><img src="${src}" onerror="this.src='${fb}'"></div>`;
        modalHtml += `<div class="swiper-slide"><div class="swiper-zoom-container"><img src="${src}" onerror="this.src='${fb}'"></div></div>`;
    }
    document.getElementById('mainWrapper').innerHTML = mainHtml;
    document.getElementById('thumbWrapper').innerHTML = thumbHtml;
    document.getElementById('modalZoomWrapper').innerHTML = modalHtml;
}

function initSwipers() {
    if (swiper1) swiper1.destroy();
    if (swiper2) swiper2.destroy();
    if (modalSwiper) modalSwiper.destroy();

    swiper1 = new Swiper(".mySwiper", { 
        spaceBetween: 10, slidesPerView: 4, freeMode: true, watchSlidesProgress: true, 
        breakpoints: { 768: { slidesPerView: 7 } } 
    });

    swiper2 = new Swiper(".mySwiper2", { 
        loop: true, spaceBetween: 10, 
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }, 
        thumbs: { swiper: swiper1 } 
    });

    // 1. 모달 스와이퍼 (모바일 줌 활성화 + PC 휠 줌 병행)
    modalSwiper = new Swiper(".modalSwiper", { 
        zoom: {
            maxRatio: 5,
            minRatio: 1,
            toggle: true, // 모바일에서 더블 탭 확대 허용
        },
        loop: true, 
        navigation: { 
            nextEl: ".image-modal .swiper-button-next", 
            prevEl: ".image-modal .swiper-button-prev" 
        } 
    });

    // 2. [PC 전용] 마우스 휠 정밀 줌 (모바일 터치와 분리)
    let currentScale = 1;
    const modalContainer = document.querySelector('.modalSwiper');

    modalContainer.onwheel = function(e) {
        // 마우스가 있을 때만 작동하도록 방어막 설정
        if (e.pointerType === 'touch') return; 
        
        e.preventDefault();
        const zoomSpeed = 0.08; // 휠 속도 (약간 올렸습니다)
        
        if (e.deltaY < 0) currentScale += zoomSpeed;
        else currentScale -= zoomSpeed;

        currentScale = Math.min(Math.max(1, currentScale), 5);

        const activeSlide = modalSwiper.slides[modalSwiper.activeIndex];
        const img = activeSlide.querySelector('.swiper-zoom-container img');
        
        if (img) {
            img.style.transition = 'transform 0.1s ease-out';
            img.style.transform = `scale(${currentScale})`;
        }
    };

    // 이미지 클릭 시 모달 열기 및 스케일 초기화
    document.querySelectorAll(".mySwiper2 .swiper-slide img").forEach(img => {
        img.onclick = function() {
            const index = this.closest('.swiper-slide').getAttribute('data-swiper-slide-index') || 0;
            currentScale = 1; // 스케일 초기화
            document.getElementById("imageModal").style.display = "flex";
            setTimeout(() => { modalSwiper.update(); modalSwiper.slideToLoop(parseInt(index), 0); }, 100);
        };
    });
}

document.querySelector(".modal-close").onclick = () => document.getElementById("imageModal").style.display = "none";
window.onload = () => selectLanguage('ko');
