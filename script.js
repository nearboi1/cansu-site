const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const bgMusic = document.getElementById('bg-music');
const bgVideo = document.getElementById('bg-video');
const msgContainer = document.getElementById('message-container');

let width, height, particles = [], fixedStars = [];

const notes = [
    "Sen sıradan biri değilsin. Senin yerini bu dünyada kimse dolduramaz.", 
    "Adını anmak bile insanın içini ısıtır",
    "Herkes parıltının peşinde, ben senin o dingin ışığına hayranım.",
    "Kırıldığın yerlerden bile ışık sızıyor",
    "Senin varlığın dünya'ya biraz daha anlam kazandıyor.",
    "Her şey çok hızlı, bir tek senin yanında yavaşlamak güzel.",
    "Gülüşün, karanlık bir günü bile hafifletmeye yeter.",
    "Yorgunluğunu kapıda bırakan o rahatlık hissisin.",
    "Karmaşık hiçbir şeye gerek yok, burada sadece biz varız.",
    "En güvenli sığınağım; seninle geçen beş dakika.", 
    "İyi ki varsın.",
    "Bazı insanlar iyidir… Sen ise huzur gibisin.",
    "Seninle her şey daha katlanılabilir.", 
    "Seninle susmak bile dünyanın en güzel sohbeti.",
    "Senin sesindeki o dinginlik, dünyanın tüm gürültüsünü bastırmaya yetiyor.",
    "Eğer bu dünya biraz daha güzel görünüyorsa, bunda senin payın var.",
    "Sadece 'an'da kalmak; ne bir eksik, ne bir fazla."
];


// ⭐ Renk paleti (gerçek yıldız tonları)
const starColors = [
    '255,255,255', // beyaz
    '255,244,214', // sıcak sarı
    '202,216,255'  // hafif mavi
];


// Yıldızları oluştur
function createFixedStars() {
    fixedStars = [];

    notes.forEach(note => {

        const randomColor = starColors[
            Math.floor(Math.random() * starColors.length)
        ];

        fixedStars.push({
            x: Math.random() * (window.innerWidth - 100) + 50,
            y: Math.random() * (window.innerHeight * 0.4 - 50) + 30,

            // ⭐ Daha büyük yıldızlar
            size: Math.random() * 2.2 + 0.8,

            note: note,
            glow: Math.random() * Math.PI,

            // ⭐ Daha yumuşak blink
            blinkSpeed: 0.008 + Math.random() * 0.015,

            color: randomColor
        });
    });
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createFixedStars();
}

window.addEventListener('resize', resize);
resize();


// BAŞLAT BUTONU
startBtn.addEventListener('click', () => {
    overlay.style.opacity = '0';

    setTimeout(() => {
        overlay.style.display = 'none';
        bgMusic.play().catch(e => console.log("Müzik çalınamadı."));
        document.getElementById("bottom-button").style.opacity = 1;
    }, 1000);
});


// ⭐⭐⭐ ULTRA GERÇEKÇİ YILDIZ
function drawFlareStar(x, y, size, opacity, color) {

    ctx.save();
    ctx.translate(x, y);

    // Büyük glow
    const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 25);
    outerGlow.addColorStop(0, `rgba(${color},${opacity * 0.15})`);
    outerGlow.addColorStop(0.4, `rgba(${color},${opacity * 0.07})`);
    outerGlow.addColorStop(1, 'transparent');

    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(0, 0, size * 25, 0, Math.PI * 2);
    ctx.fill();


    // Orta glow
    const midGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 10);
    midGlow.addColorStop(0, `rgba(${color},${opacity * 0.35})`);
    midGlow.addColorStop(1, 'transparent');

    ctx.fillStyle = midGlow;
    ctx.beginPath();
    ctx.arc(0, 0, size * 10, 0, Math.PI * 2);
    ctx.fill();


    // Çekirdek
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.3, 0, Math.PI * 2);
    ctx.fill();


    // Lens flare
    ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.5})`;
    ctx.lineWidth = 0.6;

    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-size * 12, 0);
        ctx.lineTo(size * 12, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 4);
    }

    ctx.restore();
}


// Parçacık sınıfı
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.life = 100;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1.2;
    }

    draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.life / 100})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


// Mouse + touch
function handleMove(e) {
    if (overlay.style.display === 'none') {

        let x, y;

        if (e.type.includes('touch')) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }

        particles.push(new Particle(x, y));
    }
}

window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove, { passive: true });


// Mesaj
window.addEventListener('click', (e) => {
    if (overlay.style.display === 'none') {

        fixedStars.forEach(star => {

            const d = Math.sqrt(
                (e.clientX - star.x) ** 2 +
                (e.clientY - star.y) ** 2
            );

            if (d < 45) {
                msgContainer.innerText = star.note;
                msgContainer.style.opacity = 1;
                setTimeout(() => msgContainer.style.opacity = 0, 6000);
            }
        });
    }
});


function animate() {

    ctx.clearRect(0, 0, width, height);

    fixedStars.forEach(star => {

        star.glow += star.blinkSpeed;

        const currentOpacity =
            0.35 + Math.abs(Math.sin(star.glow)) * 0.65;

        drawFlareStar(
            star.x,
            star.y,
            star.size,
            currentOpacity,
            star.color
        );
    });

    particles.forEach((p, i) => {
        p.update();
        p.draw();

        if (p.life <= 0)
            particles.splice(i, 1);
    });

    requestAnimationFrame(animate);
}

animate();
