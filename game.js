const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const speedDisplay = document.getElementById('speed');
const lapDisplay = document.getElementById('lap');
const timeDisplay = document.getElementById('time');
const restartBtn = document.getElementById('restartBtn');

// Canvas size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Game variables
let gameRunning = true;
let startTime = Date.now();
let lapCount = 1;
let lastLapCheck = 0;

// Car object
const car = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 20,
    height: 30,
    angle: -Math.PI / 2,
    speed: 0,
    maxSpeed: 500,
    acceleration: 300,
    friction: 0.96,
    turnSpeed: 0.08,
    vx: 0,
    vy: 0
};

// Track definition
const track = {
    centerX: canvas.width / 2,
    centerY: canvas.height / 2,
    outerRadius: Math.min(canvas.width, canvas.height) / 2 - 30,
    innerRadius: Math.min(canvas.width, canvas.height) / 2 - 100,
    width: 80
};

// Touch controls
let touchStartX = 0;
let touchStartY = 0;
let currentTouchX = 0;
let currentTouchY = 0;
let isAccelerating = false;

canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    currentTouchX = touch.clientX;
    currentTouchY = touch.clientY;
});

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    currentTouchX = touch.clientX;
    currentTouchY = touch.clientY;
    
    const rect = canvas.getBoundingClientRect();
    const touchY = touch.clientY - rect.top;
    
    // Accelerate if touching upper third
    isAccelerating = touchY < canvas.height / 3;
});

canvas.addEventListener('touchend', () => {
    isAccelerating = false;
});

// Restart button
restartBtn.addEventListener('click', () => {
    car.x = canvas.width / 2;
    car.y = canvas.height - 100;
    car.angle = -Math.PI / 2;
    car.speed = 0;
    car.vx = 0;
    car.vy = 0;
    lapCount = 1;
    startTime = Date.now();
    gameRunning = true;
    lastLapCheck = 0;
});

// Check if car is on track
function isOnTrack(x, y) {
    const dx = x - track.centerX;
    const dy = y - track.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance >= track.innerRadius && distance <= track.outerRadius;
}

// Check for lap completion
function checkLapCompletion() {
    const dx = car.x - track.centerX;
    const dy = car.y - track.centerY;
    const angle = Math.atan2(dy, dx);
    
    // Convert angle to 0-2PI range
    let normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle;
    
    // Check if crossed the finish line (around 270 degrees / -90 degrees)
    const finishLineAngle = Math.PI * 1.5; // 270 degrees
    const tolerance = 0.3;
    
    let crossedFinishLine = false;
    
    if (lastLapCheck < finishLineAngle - tolerance && normalizedAngle > finishLineAngle - tolerance) {
        crossedFinishLine = true;
    } else if (lastLapCheck > finishLineAngle + tolerance && normalizedAngle < finishLineAngle + tolerance) {
        crossedFinishLine = true;
    }
    
    lastLapCheck = normalizedAngle;
    
    if (crossedFinishLine && isOnTrack(car.x, car.y)) {
        lapCount++;
    }
}

// Update game state
function update(deltaTime) {
    // Handle steering
    if (currentTouchX !== 0) {
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const touchX = currentTouchX - (rect.left + centerX);
        
        if (touchX < -30) {
            car.angle -= car.turnSpeed;
        } else if (touchX > 30) {
            car.angle += car.turnSpeed;
        }
    }
    
    // Handle acceleration
    if (isAccelerating) {
        car.speed = Math.min(car.speed + car.acceleration * deltaTime, car.maxSpeed);
    } else {
        car.speed *= car.friction;
    }
    
    // Update velocity
    car.vx = Math.cos(car.angle) * car.speed;
    car.vy = Math.sin(car.angle) * car.speed;
    
    // Update position
    car.x += car.vx * deltaTime;
    car.y += car.vy * deltaTime;
    
    // Collision detection
    if (!isOnTrack(car.x, car.y)) {
        // Bounce back
        car.x -= car.vx * deltaTime;
        car.y -= car.vy * deltaTime;
        car.speed *= 0.5;
    }
    
    // Check lap completion
    checkLapCompletion();
    
    // Update HUD
    speedDisplay.textContent = Math.round(car.speed);
    lapDisplay.textContent = lapCount;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Draw track
function drawTrack() {
    // Outer track border
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(track.centerX, track.centerY, track.outerRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner track border
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(track.centerX, track.centerY, track.innerRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Grass
    ctx.fillStyle = '#2d5016';
    ctx.beginPath();
    ctx.arc(track.centerX, track.centerY, track.innerRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Finish line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(track.centerX - 40, track.centerY - track.outerRadius - 20);
    ctx.lineTo(track.centerX + 40, track.centerY - track.outerRadius - 20);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Draw car
function drawCar() {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle + Math.PI / 2);
    
    // Car body
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    
    // Car window
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(-car.width / 2 + 2, -car.height / 2 + 5, car.width - 4, car.height / 3);
    
    ctx.restore();
}

// Main game loop
let lastTime = Date.now();
function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (gameRunning) {
        update(deltaTime);
    }
    
    drawTrack();
    drawCar();
    
    requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});