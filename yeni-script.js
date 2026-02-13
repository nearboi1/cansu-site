const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
let risingParticles = []; 

const PARTICLE_COUNT = 6000;
let HEART_SCALE; // 🔥 artık sabit değil
const FORM_SPEED = 0.007;
let THICKNESS; // 🔥 artık sabit değil

function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    // 🔥 Ekrana göre otomatik ölçek
    const base = Math.min(width, height);

    HEART_SCALE = base / 38;   // kalbin genel boyutu
    THICKNESS = base / 45;     // çizgi kalınlığı

    createParticles(); // 🔥 resize olunca kalp yeniden oluşsun
}
window.addEventListener("resize", resize);
resize();

function heartFunction(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

    return { x, y };
}

function createParticles() {
    particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const t = Math.random() * Math.PI * 2;
        const pos = heartFunction(t);

        const offsetX = (Math.random() - 0.5) * THICKNESS;
        const offsetY = (Math.random() - 0.5) * THICKNESS;

        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            targetX: width / 2 + pos.x * HEART_SCALE + offsetX,
            targetY: height / 2 - pos.y * HEART_SCALE + offsetY,
            size: Math.random() * 4 + 2.5,
            vx: 0,
            vy: 0
        });
    }
}

createParticles();

let pulseTime = 0;
const pulseSpeed = 0.002;
const pulseAmount = 0.05;

function explode(x, y) {
    particles.forEach(p => {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
            const angle = Math.atan2(dy, dx);
            const force = (120 - dist) / 4;

            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
        }
    });
}

canvas.addEventListener("mousemove", e => {
    explode(e.clientX, e.clientY);
});

canvas.addEventListener("touchmove", e => {
    const touch = e.touches[0];
    explode(touch.clientX, touch.clientY);
});

function spawnRisingParticle() {
    risingParticles.push({
        x: Math.random() * width,
        y: height + 10,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 0.8 + 0.3,
        alpha: Math.random() * 0.5 + 0.3
    });
}

function updateRisingParticles() {

    if (Math.random() < 0.08) {
        spawnRisingParticle();
    }

    for (let i = risingParticles.length - 1; i >= 0; i--) {
        const p = risingParticles[i];

        p.y -= p.speedY;
        p.alpha -= 0.0015;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.globalAlpha = 1;

        if (p.alpha <= 0) {
            risingParticles.splice(i, 1);
        }
    }
}

function animate() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    updateRisingParticles();

    pulseTime += 1;
    const scale = 1 + Math.sin(pulseTime * pulseSpeed) * pulseAmount;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-width / 2, -height / 2);

    particles.forEach(p => {

        p.x += (p.targetX - p.x) * FORM_SPEED;
        p.y += (p.targetY - p.y) * FORM_SPEED;

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.92;
        p.vy *= 0.92;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#ff6fae";
        ctx.fill();
    });

    ctx.restore();

    requestAnimationFrame(animate);
}

animate();

/* BUTON GEÇİŞ */
const nextPageBtn = document.getElementById("nextPageBtn");

nextPageBtn.addEventListener("click", () => {
    window.location.href = "ucuncu-sayfa.html";
});
