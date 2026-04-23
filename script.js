const CONFIG = {
    ko: {
        title: "사무엘커뮤니티 소식지 < 갈릴리 이야기 >",
        imgPrefix: "images/magazine/galilee",
        count: 17,
        footer: "전화 : 054-533-1907 │ 팩스 : 054-533-1908 │ 주소 : 37141 경북 상주시 화남면 원정소곡로 629"
    },
    en: {
        title: "Samuel Community Newsletter < Galilee Story >",
        imgPrefix: "images/magazine_en/galilee_en", 
        count: 17,
        footer: "Tel: +82-54-533-1907 | Addr: 629, Wonjeongsogok-ro, Sangju-si, Gyeongbuk"
    }
};

let currentLang = 'ko';
let swiper1, swiper2, modalSwiper;

function renderContent(lang) {
    const data = CONFIG[lang];
    document.getElementById('mag-title').innerText = data.title;
    document.getElementById('footer-text').innerText = data.footer;
    
    // innerHTML을 사용해야 <br> 태그가 적용됩니다.
    document.querySelectorAll('.link-label').forEach(el => {
        el.innerHTML = el.getAttribute(`data-${lang}`);
    });

    let mainHtml = '', thumbHtml = '', modalHtml = '';
    for (let i = 1; i <= data.count; i++) {
        const imgSrc = `${data.imgPrefix}${i}.jpg`;
        const fallbackImg = `images/magazine/galilee${i}.jpg`;
        
        mainHtml += `<div class="swiper-slide"><img src="${imgSrc}" onerror="this.src='${fallbackImg}'"></div>`;
        thumbHtml += `<div class="swiper-slide"><img src="${imgSrc}" onerror="this.src='${fallbackImg}'"></div>`;
        modalHtml += `<div class="swiper-slide"><div class="swiper-zoom-container"><img src="${imgSrc}" onerror="this.src='${fallbackImg}'"></div></div>`;
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
        loop: true,
        spaceBetween: 20,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true, 
        breakpoints: { 768: { slidesPerView: 7 } }
    });

    swiper2 = new Swiper(".mySwiper2", {
        loop: true,
        spaceBetween: 10,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        thumbs: { swiper: swiper1 },
    });

    modalSwiper = new Swiper(".modalSwiper", {
        zoom: true,
        speed: 400,
        navigation: { nextEl: ".image-modal .swiper-button-next", prevEl: ".image-modal .swiper-button-prev" },
    });

    document.querySelectorAll(".mySwiper2 .swiper-slide").forEach(slide => {
        slide.addEventListener("click", function() {
            const realIndex = this.getAttribute('data-swiper-slide-index');
            if (realIndex !== null) {
                const modal = document.getElementById("imageModal");
                modal.style.display = "flex";
                setTimeout(() => {
                    modal.classList.add("active");
                    modalSwiper.update();
                    modalSwiper.slideTo(parseInt(realIndex), 0);
                }, 50);
            }
        });
    });
}

function setLanguage(lang) {
    currentLang = lang;
    const btnKo = document.getElementById('lang-ko');
    const btnEn = document.getElementById('lang-en');
    const switchBox = document.getElementById('switch-box');

    if (lang === 'ko') {
        btnKo.classList.add('active');
        btnEn.classList.remove('active');
        switchBox.classList.remove('en-active');
    } else {
        btnKo.classList.remove('active');
        btnEn.classList.add('active');
        switchBox.classList.add('en-active');
    }

    renderContent(lang);
    initSwipers();
}

document.querySelector(".modal-close").addEventListener("click", () => {
    const modal = document.getElementById("imageModal");
    modal.classList.remove("active");
    setTimeout(() => { modal.style.display = "none"; }, 300);
});

window.onload = () => setLanguage('ko');