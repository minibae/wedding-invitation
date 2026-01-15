document.addEventListener('DOMContentLoaded', () => {

    // Fade-in Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Initialize Kakao Map
    var mapContainer = document.getElementById('map');
    if (mapContainer && typeof kakao !== 'undefined') {
        var mapOption = {
            center: new kakao.maps.LatLng(37.539171981020196, 127.0696543695598), // 까사그랑데 센트로
            level: 3 // 확대 레벨 (1-14, 숫자가 작을수록 확대)
        };

        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 마커 위치 설정
        var markerPosition = new kakao.maps.LatLng(37.539171981020196, 127.0696543695598);

        // 마커 생성
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });

        // 마커를 지도에 표시
        marker.setMap(map);
    }

    // RSVP Form Handling
    const form = document.getElementById('rsvp-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const attending = document.getElementById('attending').value;
        const guests = document.getElementById('guests').value;

        // Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwbga3BMoZFE7vaMUrcAdHW9q99QIJ7UTYfNY-p9ztxLhgWptsCi26rnTd3z7QOApfafw/exec';

        // Show loading state
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = '전송 중... (잠시만 기다려주세요)';
        btn.disabled = true;

        // Add timestamp to URL to prevent browser caching
        const cacheBuster = scriptURL + "?t=" + new Date().getTime();

        fetch(cacheBuster, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                // Simplest header to avoid CORS preflight options
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({ name, attending, guests })
        })
            .then(() => {
                alert(`${name}님, 참석 여부가 전달되었습니다. 감사합니다!`);
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('오류가 발생했습니다. 다시 시도해 주세요.');
            })
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
    });

    // Accordion Handling
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});

// Copy Link Function
// Copy Link Function
function copyLink() {
    const url = window.location.href;
    copyText(url, '링크가 복사되었습니다!');
}

// Generic Copy Function
function copyText(text, message = '복사되었습니다!') {
    navigator.clipboard.writeText(text).then(() => {
        alert(message);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
        alert(message);
    });
}
