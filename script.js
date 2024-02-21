const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    image: new Image(),
    speed: 50,
};

player.image.src = 'racoon.png';

const fallingObjects = [];
const objectSize = 40;
const objectImage = new Image();
objectImage.src = 'trash.png';
const objectSpeed = 4;
let score = 0;
let isPaused = false;

let spawnInterval = 1000;
let lastSpawnTime = 0;

// Add audio elements
const collisionSound = new Audio('collision.mp3');
const movementSound = new Audio('movement.mp3');
let isMuted = false;

function playMovementSound() {
    if (!isMuted) {
        console.log('Playing movement sound');
        movementSound.currentTime = 0;
        movementSound.play();
    }
}

function playCollisionSound() {
    if (!isMuted) {
        console.log('Playing collision sound');
        collisionSound.currentTime = 0;
        collisionSound.play();
    }
}

function muteAudio() {
    isMuted = true;
}

function unmuteAudio() {
    isMuted = false;
}

function toggleMute() {
    isMuted = !isMuted;
    const muteButton = document.getElementById('muteToggle');
    
    if (isMuted) {
        muteAudio();
        muteButton.textContent = 'Unmute Sound';
        console.log('Audio muted');
    } else {
        unmuteAudio();
        muteButton.textContent = 'Mute Sound';
        console.log('Audio unmuted');
    }
}

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function handleInput() {
    document.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouchStart);
}

function handleKeyDown(event) {
    if (!isPaused) {
        if (event.key === 'ArrowLeft') {
            movePlayer('left');
        } else if (event.key === 'ArrowRight') {
            movePlayer('right');
        }
    }
}

function handleTouchStart(event) {
    if (!isPaused) {
        const touchX = event.touches[0].clientX;
        const canvasCenter = canvas.width / 2;

        if (touchX < canvasCenter) {
            movePlayer('left');
        } else {
            movePlayer('right');
        }
    }
}

function movePlayer(direction) {
    playMovementSound(); // Play the movement sound

    if (direction === 'left') {
        player.x -= player.speed;
    } else if (direction === 'right') {
        player.x += player.speed;
    }

    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
}

function moveObjects() {
    fallingObjects.forEach(object => {
        object.y += objectSpeed;

        if (
            object.y + objectSize / 2 > player.y - player.height / 2 &&
            object.y - objectSize / 2 < player.y + player.height / 2 &&
            object.x + objectSize / 2 > player.x - player.width / 2 &&
            object.x - objectSize / 2 < player.x + player.width / 2
        ) {
            if (object.y - objectSize / 2 < player.y - player.height / 2) {
                removeObject(object);
                increaseScore();
            }
        }

        if (object.y - objectSize / 2 > canvas.height) {
            removeObject(object);
        }
    });
}

function increaseScore() {
    score += 1;
    updateScoreDisplay();
    playCollisionSound();
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = 'Score: ' + score;
    }
}

function removeObject(object) {
    const index = fallingObjects.indexOf(object);
    fallingObjects.splice(index, 1);
}

function generateObject() {
    const object = {
        x: Math.random() * canvas.width,
        y: 0,
    };
    fallingObjects.push(object);
}

function drawPlayer() {
    ctx.drawImage(player.image, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

function drawObjects() {
    fallingObjects.forEach(object => {
        ctx.drawImage(objectImage, object.x - objectSize / 2, object.y - objectSize / 2, objectSize, objectSize);
    });
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawObjects();
}

function updateGame() {
    if (!isPaused) {
        moveObjects();
        drawGame();
        requestAnimationFrame(updateGame);

        const currentTime = new Date().getTime();
        if (currentTime - lastSpawnTime > spawnInterval) {
            generateObject();
            lastSpawnTime = currentTime;
            spawnInterval = Math.max(500, spawnInterval - 20);
        }
    }
}

function init() {
    setCanvasSize();
    handleInput();
    updateScoreDisplay();
    updateGame();
}

// Initialize the game
init();

function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    if (!isPaused) {
        updateGame();
    }
}

// Add event listener for the mute/unmute toggle button
const muteToggle = document.getElementById('muteToggle');
muteToggle.addEventListener('click', toggleMute);

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', togglePause);

window.addEventListener('resize', setCanvasSize);
