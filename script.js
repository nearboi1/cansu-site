const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const jumpBtn = document.getElementById("jumpBtn");

const CONFIG = {
  particleCount: 2000,
  baseEventHorizon: 120,
  gravity: 0.15,
  backgroundFade: 0.08,
  maxDistanceFactor: 0.9
};

let particles = [];
let eventHorizon = CONFIG.baseEventHorizon;

let zoomLevel = 1;
let velocity = 0;
let acceleration = 0.00008; // düşüş hızını buradan ayarlıyorsun
let isJumping = false;

let showText = false;
let textAlpha = 0;
let blackScreen = false;

// ======================
// Resize
// ======================
function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

// ======================
// Button
// ======================
jumpBtn.addEventListener("click", () => {
  isJumping = true;
  jumpBtn.style.opacity = "0";
  jumpBtn.style.pointerEvents = "none";
});

// ======================
// Particle
// ======================
class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.angle = Math.random() * Math.PI * 2;
    this.distance =
      Math.random() * Math.max(canvas.width, canvas.height) *
        CONFIG.maxDistanceFactor +
      eventHorizon;

    this.speed = Math.random() * 0.02 + 0.005;
    this.size = Math.random() * 1.2;
    this.alpha = initial ? Math.random() * 0.6 : 0;
  }

  update() {
    this.angle += this.speed;

    let gravityForce = CONFIG.gravity;
    if (isJumping) gravityForce *= 5;

    this.distance -= gravityForce * (1 + 200 / this.distance);

    if (this.distance <= eventHorizon) {
      this.reset();
    }

    this.x =
      canvas.width / 2 +
      Math.cos(this.angle) * this.distance;
    this.y =
      canvas.height / 2 +
      Math.sin(this.angle) * this.distance;

    if (this.alpha < 0.7) this.alpha += 0.01;
  }

  draw() {
    ctx.fillStyle = `rgba(120,180,255,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * zoomLevel, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ======================
// Black Hole
// ======================
function drawBlackHole() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const glow = ctx.createRadialGradient(
    centerX,
    centerY,
    eventHorizon,
    centerX,
    centerY,
    eventHorizon * 2
  );

  glow.addColorStop(0, "rgba(80,120,255,0.5)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, eventHorizon * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(centerX, centerY, eventHorizon, 0, Math.PI * 2);
  ctx.fill();
}

// ======================
// Init
// ======================
function init() {
  particles = [];
  for (let i = 0; i < CONFIG.particleCount; i++) {
    particles.push(new Particle());
  }
}

// ======================
// Animate
// ======================
function animate() {

  if (!blackScreen) {
    ctx.fillStyle = `rgba(0,0,10,${CONFIG.backgroundFade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (isJumping && !blackScreen) {
    velocity += acceleration;
    zoomLevel += velocity;
    eventHorizon += velocity * 5;

    if (zoomLevel > 8) {
      blackScreen = true;

      // 1 saniye sonra yazı gelsin
      setTimeout(() => {
        showText = true;
      }, 1000);
    }
  }

  if (!blackScreen) {
    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    drawBlackHole();

    for (let p of particles) {
      p.update();
      p.draw();
    }

    ctx.restore();
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ======================
  // FINAL TEXT
  // ======================
  if (showText) {
    if (textAlpha < 1) textAlpha += 0.01;

    ctx.fillStyle = `rgba(255,255,255,${textAlpha})`;
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Sessizliğin en büyük haykırış",
      canvas.width / 2,
      canvas.height / 2
    );
  }

  requestAnimationFrame(animate);
}

init();
animate();