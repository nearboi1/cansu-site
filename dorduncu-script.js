const player = document.getElementById('player');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

let playerPos = 0;
let score = 0;
let hearts = [];

let moveLeft = false;
let moveRight = false;

const PLAYER_WIDTH = 240;
const HEART_SIZE = 20;

function centerPlayer(){
    playerPos = (game.offsetWidth / 2) - (PLAYER_WIDTH / 2);
    player.style.left = playerPos + 'px';
}

window.addEventListener("load", centerPlayer);
window.addEventListener("resize", centerPlayer);

// KLAVYE
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') moveLeft = true;
    if(e.key === 'ArrowRight') moveRight = true;
});

document.addEventListener('keyup', (e) => {
    if(e.key === 'ArrowLeft') moveLeft = false;
    if(e.key === 'ArrowRight') moveRight = false;
});

// BUTON
function pressLeft(){ moveLeft = true; }
function releaseLeft(){ moveLeft = false; }

function pressRight(){ moveRight = true; }
function releaseRight(){ moveRight = false; }

// mouse
leftBtn.addEventListener('mousedown', pressLeft);
leftBtn.addEventListener('mouseup', releaseLeft);
leftBtn.addEventListener('mouseleave', releaseLeft);

rightBtn.addEventListener('mousedown', pressRight);
rightBtn.addEventListener('mouseup', releaseRight);
rightBtn.addEventListener('mouseleave', releaseRight);

// 🔥 TOUCH FIX
leftBtn.addEventListener('touchstart', (e)=>{
    e.preventDefault();
    pressLeft();
});

leftBtn.addEventListener('touchend', releaseLeft);

rightBtn.addEventListener('touchstart', (e)=>{
    e.preventDefault();
    pressRight();
});

rightBtn.addEventListener('touchend', releaseRight);


// KALP
function createHeart() {

    const heart = document.createElement('div');
    heart.classList.add('heart');

    heart.style.left =
        Math.random() * (game.offsetWidth - HEART_SIZE) + 'px';

    heart.style.top = '0px';

    game.appendChild(heart);
    hearts.push(heart);
}

// LOOP
function updateGame() {

    if(moveLeft) playerPos -= 8;
    if(moveRight) playerPos += 8;

    if(playerPos < 0) playerPos = 0;

    if(playerPos > game.offsetWidth - PLAYER_WIDTH)
        playerPos = game.offsetWidth - PLAYER_WIDTH;

    player.style.left = playerPos + 'px';

    hearts.forEach((heart, index) => {

        let heartTop = parseFloat(heart.style.top);
        heartTop += 2.4;
        heart.style.top = heartTop + 'px';

        let heartLeft = parseFloat(heart.style.left);

        const playerTop = game.offsetHeight - 270;

        if(
            heartTop + HEART_SIZE >= playerTop &&
            heartLeft + HEART_SIZE > playerPos + 25 &&
            heartLeft < playerPos + PLAYER_WIDTH - 25
        ){
            score++;
            scoreDisplay.textContent = 'Puan: ' + score;

            heart.remove();
            hearts.splice(index,1);
        }

        if(heartTop > game.offsetHeight){
            heart.remove();
            hearts.splice(index,1);
        }

    });
}

setInterval(updateGame, 16);
setInterval(createHeart, 750);
