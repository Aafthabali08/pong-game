// Canvas setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 10;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const PADDLE_MARGIN = 10;
const PADDLE_SPEED = 5;
const AI_SPEED = 4;

// Game state
let leftPaddleY = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let rightPaddleY = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = CANVAS_WIDTH / 2;
let ballY = CANVAS_HEIGHT / 2;
let ballSpeedX = Math.random() < 0.5 ? 4 : -4;
let ballSpeedY = (Math.random() - 0.5) * 6;
let scoreLeft = 0;
let scoreRight = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp the paddle within the canvas
    if (leftPaddleY < 0) leftPaddleY = 0;
    if (leftPaddleY > CANVAS_HEIGHT - PADDLE_HEIGHT) leftPaddleY = CANVAS_HEIGHT - PADDLE_HEIGHT;
});

// AI control for right paddle
function moveAIPaddle() {
    let paddleCenter = rightPaddleY + PADDLE_HEIGHT / 2;
    if (paddleCenter < ballY - 10) {
        rightPaddleY += AI_SPEED;
    } else if (paddleCenter > ballY + 10) {
        rightPaddleY -= AI_SPEED;
    }
    // Clamp AI paddle
    if (rightPaddleY < 0) rightPaddleY = 0;
    if (rightPaddleY > CANVAS_HEIGHT - PADDLE_HEIGHT) rightPaddleY = CANVAS_HEIGHT - PADDLE_HEIGHT;
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw left paddle
    ctx.fillStyle = "#fff";
    ctx.fillRect(PADDLE_MARGIN, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw right paddle
    ctx.fillStyle = "#fff";
    ctx.fillRect(CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

// Collision detection
function checkCollision() {
    // Top and bottom wall collision
    if (ballY - BALL_RADIUS <= 0 || ballY + BALL_RADIUS >= CANVAS_HEIGHT) {
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision
    if (
        ballX - BALL_RADIUS <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_RADIUS >= leftPaddleY &&
        ballY - BALL_RADIUS <= leftPaddleY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on hit position
        let hitPos = (ballY - (leftPaddleY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 2;
        ballX = PADDLE_MARGIN + PADDLE_WIDTH + BALL_RADIUS; // Prevent sticking
    }

    // Right paddle collision
    if (
        ballX + BALL_RADIUS >= CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_RADIUS >= rightPaddleY &&
        ballY - BALL_RADIUS <= rightPaddleY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add "spin"
        let hitPos = (ballY - (rightPaddleY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 2;
        ballX = CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_RADIUS; // Prevent sticking
    }
}

// Score and reset
function checkScore() {
    if (ballX < 0) {
        // Right scores
        scoreRight++;
        resetBall();
    } else if (ballX > CANVAS_WIDTH) {
        // Left scores
        scoreLeft++;
        resetBall();
    }
    document.getElementById('score-left').textContent = scoreLeft;
    document.getElementById('score-right').textContent = scoreRight;
}

function resetBall() {
    ballX = CANVAS_WIDTH / 2;
    ballY = CANVAS_HEIGHT / 2;
    ballSpeedX = Math.random() < 0.5 ? 4 : -4;
    ballSpeedY = (Math.random() - 0.5) * 6;
}

// Main game loop
function gameLoop() {
    moveAIPaddle();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    checkCollision();
    checkScore();
    draw();

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
