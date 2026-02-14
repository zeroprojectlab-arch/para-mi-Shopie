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

// Constants
const GROUND_Y = 450;
const HEART_START_Y = 200;
const TARGET_HEART_Y = 420;

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
    const maxTrunkHeight = 120;

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
    const duration = 2500;
    const startTime = Date.now();
    const totalBranches = 5;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        branchesGrown = Math.floor(progress * totalBranches);

        // Draw scene
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGround();
        drawTrunk(300, GROUND_Y, trunkHeight);
        drawBranches(300, GROUND_Y - trunkHeight, branchesGrown);

        if (progress < 1) {
            animationId = requestAnimationFrame(animate);
        } else {
            state = 'complete';
            showFinalMessage();
        }
    }

    animate();
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
    
    // Draw trunk (brown cone/triangle shape)
    ctx.beginPath();
    ctx.fillStyle = '#5d3a1a';
    ctx.moveTo(-20, 0); // Wide at bottom
    ctx.lineTo(0, -height); // Pointed at top
    ctx.lineTo(20, 0); // Wide at bottom
    ctx.closePath();
    ctx.fill();
    
    // Add trunk details
    ctx.strokeStyle = '#3d2510';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
}

function drawBranches(baseX, topY, count) {
    const branchData = [
        { angle: -60, length: 60, heartY: -30 },
        { angle: -40, length: 80, heartY: -40 },
        { angle: -20, length: 70, heartY: -35 },
        { angle: 20, length: 70, heartY: -35 },
        { angle: 40, length: 80, heartY: -40 },
        { angle: 60, length: 60, heartY: -30 }
    ];

    for (let i = 0; i < Math.min(count, branchData.length); i++) {
        const branch = branchData[i];
        const angleRad = (branch.angle * Math.PI) / 180;
        
        const startX = baseX;
        const startY = topY + branch.heartY;
        const endX = startX + Math.cos(angleRad) * branch.length;
        const endY = startY + Math.sin(angleRad) * branch.length;
        
        // Draw branch
        ctx.beginPath();
        ctx.strokeStyle = '#5d3a1a';
        ctx.lineWidth = 4;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Draw red heart at tip
        drawRedHeart(endX, endY);
    }
}

function drawRedHeart(x, y) {
    ctx.save();
    ctx.translate(x, y);
    
    ctx.beginPath();
    ctx.fillStyle = '#ff1a1a';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 15;
    
    const size = 12;
    ctx.moveTo(0, -size / 2);
    ctx.bezierCurveTo(size / 2, -size, size, -size / 3, 0, size / 2);
    ctx.bezierCurveTo(-size, -size / 3, -size / 2, -size, 0, -size / 2);
    ctx.fill();
    
    ctx.restore();
}
