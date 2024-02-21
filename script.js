const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 50,
    image: new Image(),
    speed: 50,
};

player.image.src = 'racoon.png'; // Set the path to the raccoon image

const fallingObjects = [];
const objectSize = 40; // Increased size for the falling objects
const objectImage = new Image();
objectImage.src = 'trash.png'; // Set the path to the trash image
const objectSpeed = 4;
let score = 0;
let isPaused = false;

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
            // Check if the object is entirely above the player
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
    }
}

function init() {
    setCanvasSize();
    handleInput();
    setInterval(generateObject, 1000);
    updateGame();
}

// Initialize the game
init();

// Pause button functionality
const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', togglePause);

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseButton.textContent = 'Resume';
    } else {
        pauseButton.textContent = 'Pause';
        updateGame();
    }
}

// Adjust canvas size on window resize
window.addEventListener('resize', setCanvasSize);
