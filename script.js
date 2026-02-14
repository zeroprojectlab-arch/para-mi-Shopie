// Canvas setup
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
const textContainer = document.getElementById('texto-regalo');
const contador = document.getElementById('contador');

// State management
let state = 'start'; // start, falling, trunk, branches, complete
let heartY = 250;
let heartScale = 1;
let trunkHeight = 0;
let branchesGrown = 0;
let animationId = null;
let branchCounter = 0;

// Constants
const GROUND_Y = 450;
const HEART_START_Y = 200;
const TARGET_HEART_Y = 420;

// Heart shape parameters for branch direction
const HEART_SCALE = 120;
const HEART_CENTER_X = 300;
const HEART_CENTER_Y = GROUND_Y - 180;

// Initial render
drawHeart(300, HEART_START_Y, 1, true);

// Click handler
canvas.addEventListener('click', () => {
    if (state === 'start') {
        state = 'falling';
        animateFalling();
    }
});

function animateFalling() {
    const startY = HEART_START_Y;
    const endY = TARGET_HEART_Y;
    const duration = 1500;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth fall
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        heartY = startY + (endY - startY) * easeProgress;
        
        // Draw scene
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGround();
        drawHeart(300, heartY, 1 - progress * 0.3, true);

        if (progress < 1) {
            animationId = requestAnimationFrame(animate);
        } else {
            state = 'trunk';
            animateTrunk();
        }
    }

    animate();
}

function animateTrunk() {
    const duration = 2000;
    const startTime = Date.now();
    const maxTrunkHeight = 180;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        
        trunkHeight = maxTrunkHeight * easeProgress;

        // Draw scene
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGround();
        drawTrunk(300, GROUND_Y, trunkHeight);

        if (progress < 1) {
            animationId = requestAnimationFrame(animate);
        } else {
            state = 'branches';
            animateBranches();
        }
    }

    animate();
}

function animateBranches() {
    const duration = 4000; // Faster for 50ms optimization
    const startTime = Date.now();
    const totalBranches = 300; // More branches for lush tree
    let lastDrawTime = 0;

    function animate(currentTime) {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        branchesGrown = Math.floor(progress * totalBranches);

        // Throttle rendering to every 50ms to avoid browser blocking
        if (currentTime - lastDrawTime >= 50 || progress >= 1) {
            lastDrawTime = currentTime;
            
            // Draw scene
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGround();
            drawTrunk(300, GROUND_Y, trunkHeight);
            
            // Draw heart-shaped branches
            branchCounter = 0;
            const baseX = 300;
            const baseY = GROUND_Y - trunkHeight;
            
            // Draw multiple branches from the top of trunk, growing in heart shape
            drawHeartBranches(baseX, baseY, branchesGrown);
        }

        if (progress < 1) {
            animationId = requestAnimationFrame(animate);
        } else {
            state = 'complete';
            showFinalMessage();
        }
    }

    animationId = requestAnimationFrame(animate);
}

function drawHeartBranches(startX, startY, maxBranches) {
    // Draw branches growing from trunk top toward heart shape
    // Heart shape: angles spread wide on sides (-80 to +80), close at top
    const initialAngles = [-80, -65, -50, -35, -20, -10, 0, 10, 20, 35, 50, 65, 80];
    const branchesPerAngle = Math.floor(maxBranches / initialAngles.length);
    
    initialAngles.forEach((angle, index) => {
        drawHeartBranch(startX, startY, 75, angle, 0, branchesPerAngle, index / initialAngles.length);
    });
}

function drawHeartBranch(startX, startY, length, angle, depth, maxBranches, heartPosition) {
    if (branchCounter >= maxBranches || length < 6) return;
    
    // Calculate end position
    const angleRad = (angle * Math.PI) / 180;
    const endX = startX + Math.cos(angleRad) * length;
    const endY = startY + Math.sin(angleRad) * length;
    
    // Draw branch
    ctx.beginPath();
    ctx.strokeStyle = '#5d3a1a';
    ctx.lineWidth = Math.max(1.5, 4 - depth * 0.5);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    branchCounter++;
    
    // Draw hearts along branch
    drawHeartsAlongBranch(startX, startY, endX, endY, length);
    
    // Continue branching - SPLIT INTO 3 BRANCHES for lush tree
    if (length > 10) {
        const newLength = length * 0.7;
        
        // Determine if left, right, or center based on angle
        const isLeftSide = angle < -15;
        const isRightSide = angle > 15;
        
        if (isLeftSide) {
            // Left side: curve more to the left
            drawHeartBranch(endX, endY, newLength, angle - 40, depth + 1, maxBranches, heartPosition - 0.06);
            drawHeartBranch(endX, endY, newLength * 0.85, angle - 25, depth + 1, maxBranches, heartPosition - 0.04);
            drawHeartBranch(endX, endY, newLength * 0.7, angle - 10, depth + 1, maxBranches, heartPosition - 0.02);
        } else if (isRightSide) {
            // Right side: curve more to the right
            drawHeartBranch(endX, endY, newLength, angle + 40, depth + 1, maxBranches, heartPosition + 0.06);
            drawHeartBranch(endX, endY, newLength * 0.85, angle + 25, depth + 1, maxBranches, heartPosition + 0.04);
            drawHeartBranch(endX, endY, newLength * 0.7, angle + 10, depth + 1, maxBranches, heartPosition + 0.02);
        } else {
            // Center branches (near top of heart): go up and outward
            drawHeartBranch(endX, endY, newLength, angle - 25, depth + 1, maxBranches, heartPosition - 0.03);
            drawHeartBranch(endX, endY, newLength, angle, depth + 1, maxBranches, heartPosition);
            drawHeartBranch(endX, endY, newLength, angle + 25, depth + 1, maxBranches, heartPosition + 0.03);
        }
    }
}

function drawHeartsAlongBranch(startX, startY, endX, endY, length) {
    // Draw hearts distributed along the branch
    const heartCount = Math.floor(length / 20);
    
    for (let i = 1; i <= heartCount; i++) {
        const pos = i / (heartCount + 1);
        if (Math.random() > 0.15) { // 85% chance for more hearts
            const x = startX + (endX - startX) * pos;
            const y = startY + (endY - startY) * pos;
            const size = 5 + Math.random() * 5;
            drawRedHeart(x, y, size);
        }
    }
    
    // Always draw heart at tip
    drawRedHeart(endX, endY, 7 + Math.random() * 4);
}

function showFinalMessage() {
    // Move canvas to the right
    canvas.classList.add('moved');
    
    // Show text container
    textContainer.classList.add('visible');
    
    // Start timer
    startTimer();
}

function startTimer() {
    const startDate = new Date('2025-09-10T09:35:00');
    
    function updateTimer() {
        const now = new Date();
        const diff = now - startDate;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        contador.textContent = `${days} días, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

function drawGround() {
    // Draw grass/ground
    ctx.fillStyle = '#1a3d1a';
    ctx.fillRect(0, GROUND_Y + 10, canvas.width, canvas.height - GROUND_Y - 10);
    
    // Draw ground line
    ctx.strokeStyle = '#2d5a2d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 10);
    ctx.lineTo(canvas.width, GROUND_Y + 10);
    ctx.stroke();
}

function drawHeart(x, y, scale, showText) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    // Draw heart shape
    ctx.beginPath();
    ctx.fillStyle = '#ff3366';
    ctx.shadowColor = '#ff6699';
    ctx.shadowBlur = 20;
    
    const heartSize = 40;
    ctx.moveTo(0, -heartSize / 2);
    ctx.bezierCurveTo(heartSize / 2, -heartSize, heartSize, -heartSize / 3, 0, heartSize / 2);
    ctx.bezierCurveTo(-heartSize, -heartSize / 3, -heartSize / 2, -heartSize, 0, -heartSize / 2);
    ctx.fill();
    
    ctx.restore();
    
    // Draw text if needed
    if (showText && state === 'start') {
        ctx.font = 'bold 24px Georgia';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 10;
        ctx.fillText('¡PRESÍONAME!', x, y + 60);
        ctx.shadowBlur = 0;
    }
}

function drawTrunk(x, baseY, height) {
    if (height <= 0) return;
    
    ctx.save();
    ctx.translate(x, baseY);
    
    // Draw trunk (brown cone/triangle shape - pointed at top)
    ctx.beginPath();
    ctx.fillStyle = '#5d3a1a';
    ctx.moveTo(-25, 0); // Wide at bottom
    ctx.lineTo(0, -height); // Pointed at top
    ctx.lineTo(25, 0); // Wide at bottom
    ctx.closePath();
    ctx.fill();
    
    // Add trunk details
    ctx.strokeStyle = '#3d2510';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
}

function drawRedHeart(x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    
    ctx.beginPath();
    ctx.fillStyle = '#ff1a1a';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 15;
    
    ctx.moveTo(0, -size / 2);
    ctx.bezierCurveTo(size / 2, -size, size, -size / 3, 0, size / 2);
    ctx.bezierCurveTo(-size, -size / 3, -size / 2, -size, 0, -size / 2);
    ctx.fill();
    
    ctx.restore();
}
