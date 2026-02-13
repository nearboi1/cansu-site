const canvas = document.getElementById("portraitCanvas");
const ctx = canvas.getContext("2d");
const nextBtn = document.getElementById("nextPageBtn");

let width, height;
let particles = [];
let bgParticles = [];

const img = new Image();
img.src = "portrait.jpg";

function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

img.onload = () => {
    createMosaic();
    createBackgroundParticles();
    animate();
};

/* ---------------- PORTRAIT ---------------- */

function createMosaic(){

    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d");

    const ratio = Math.min(width / img.width, height / img.height) * 0.8;

    const imgWidth = Math.floor(img.width * ratio);
    const imgHeight = Math.floor(img.height * ratio);

    offCanvas.width = imgWidth;
    offCanvas.height = imgHeight;

    offCtx.drawImage(img, 0, 0, imgWidth, imgHeight);

    const imageData = offCtx.getImageData(0, 0, imgWidth, imgHeight).data;

    const gap = 6;
    particles = [];

    for(let y = 0; y < imgHeight; y += gap){
        for(let x = 0; x < imgWidth; x += gap){

            const sampleX = Math.floor(x + gap / 2);
            const sampleY = Math.floor(y + gap / 2);

            if(sampleX >= imgWidth || sampleY >= imgHeight) continue;

            const index = (sampleY * imgWidth + sampleX) * 4;

            const r = imageData[index];
            const g = imageData[index + 1];
            const b = imageData[index + 2];

            const brightness = (r + g + b) / 3;
            const targetSize = Math.max(1.2, (255 - brightness) / 35);

            const drawX = width/2 - imgWidth/2 + x;
            const drawY = height/2 - imgHeight/2 + y;

            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,

                baseX: drawX,
                baseY: drawY,

                size: targetSize,
                color: `rgb(${r},${g},${b})`,
                vx: 0,
                vy: 0
            });
        }
    }
}

/* ---------------- BACKGROUND PARTICLES ---------------- */

function createBackgroundParticles(){

    bgParticles = [];

    const colors = [
        "rgba(255,105,180,0.6)",
        "rgba(255,0,0,0.5)",
        "rgba(128,0,32,0.6)",
        "rgba(220,20,60,0.5)"
    ];

    for(let i = 0; i < 120; i++){
        bgParticles.push({
            x: Math.random() * width,
            y: height + Math.random() * height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.7 + 0.3,
            color: colors[Math.floor(Math.random() * colors.length)],
            drift: (Math.random() - 0.5) * 0.5
        });
    }
}

/* ---------------- ANIMATION ---------------- */

function animate(){

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    // Arka plan
    bgParticles.forEach(p => {

        p.y -= p.speed;
        p.x += p.drift;

        if(p.y < -10){
            p.y = height + 10;
            p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });

    // Portre
    particles.forEach(p => {

        p.x += (p.baseX - p.x) * 0.03;
        p.y += (p.baseY - p.y) * 0.03;

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.9;
        p.vy *= 0.9;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

/* ---------------- INTERACTION ---------------- */

function explode(x,y){
    particles.forEach(p => {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if(dist < 70){
            const angle = Math.atan2(dy, dx);
            const force = (70 - dist) / 6;

            p.vx += Math.cos(angle)*force;
            p.vy += Math.sin(angle)*force;
        }
    });
}

canvas.addEventListener("mousemove", e=>{
    explode(e.clientX, e.clientY);
});

canvas.addEventListener("touchmove", e=>{
    const touch = e.touches[0];
    explode(touch.clientX, touch.clientY);
});

/* ---------------- PAGE TRANSITION ---------------- */

nextBtn.addEventListener("click", () => {
    document.body.style.transition = "1s";
    document.body.style.opacity = "0";

    setTimeout(()=>{
        window.location.href = "paytak.html";
    },1000);
});
