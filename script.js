// Canvas setup
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
const textContainer = document.getElementById('texto-regalo');
const contador = document.getElementById('contador');

// State management
let state = 'start'; 
let heartY = 250;
let trunkHeight = 0;
let branchesGrown = 0;
let animationId = null;

const GROUND_Y = 450;
const HEART_START_Y = 200;
const TARGET_HEART_Y = 420;

// Initial render
drawHeart(300, HEART_START_Y, 1, true);

canvas.addEventListener('click', () => {
    if (state === 'start') {
        state = 'falling';
        animateFalling();
    }
});

function animateFalling() {
    const duration = 1500;
    const startTime = Date.now();
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        heartY = HEART_START_Y + (TARGET_HEART_Y - HEART_START_Y) * easeProgress;
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
    const maxTrunkHeight = 150; 
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        trunkHeight = maxTrunkHeight * (1 - Math.pow(1 - progress, 2));
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
    const duration = 4000;
    const startTime = Date.now();
    const totalBranches = 80; // Más elementos para el relleno
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        branchesGrown = Math.floor(progress * totalBranches);
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

function drawTrunk(x, baseY, height) {
    if (height <= 0) return;
    ctx.save();
    ctx.translate(x, baseY);
    ctx.beginPath();
    ctx.fillStyle = '#4b2c20';
    ctx.moveTo(-20, 0); 
    ctx.lineTo(0, -height); 
    ctx.lineTo(20, 0); 
    ctx.fill();
    ctx.restore();
}

function drawBranches(baseX, topY, count) {
    const branchData = [];
    // Generamos puntos para el borde y el relleno del corazón
    for(let i=0; i<80; i++) {
        let t = Math.random() * Math.PI * 2;
        let r = Math.sqrt(Math.random()); // Factor para rellenar el interior
        
        // Ecuación del corazón
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        // Multiplicamos por 'r' para que algunos queden adentro y otros afuera
        branchData.push({ 
            dx: x * 5 * r, 
            dy: y * 5 * r, 
            size: 5 + Math.random() * 10 // Tamaños variados como en la imagen
        });
    }

    for (let i = 0; i < Math.min(count, branchData.length); i++) {
        const b = branchData[i];
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(75, 44, 32, 0.4)'; // Ramas más suaves para que luzcan los corazones
        ctx.lineWidth = 1;
        ctx.moveTo(baseX, topY);
        ctx.lineTo(baseX + b.dx, topY + b.dy);
        ctx.stroke();
        drawRedHeart(baseX + b.dx, topY + b.dy, b.size);
    }
}

function drawRedHeart(x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.fillStyle = '#ff1a1a';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 8;
    ctx.moveTo(0, -size / 2);
    ctx.bezierCurveTo(size / 2, -size, size, -size / 3, 0, size / 2);
    ctx.bezierCurveTo(-size, -size / 3, -size / 2, -size, 0, -size / 2);
    ctx.fill();
    ctx.restore();
}

function drawHeart(x, y, scale, showText) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.fillStyle = '#ff3366';
    const size = 40;
    ctx.moveTo(0, -size / 2);
    ctx.bezierCurveTo(size / 2, -size, size, -size / 3, 0, size / 2);
    ctx.bezierCurveTo(-size, -size / 3, -size / 2, -size, 0, -size / 2);
    ctx.fill();
    ctx.restore();
    if (showText && state === 'start') {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('¡PRESÍONAME!', x, y + 60);
    }
}

function drawGround() {
    ctx.fillStyle = '#1a3d1a';
    ctx.fillRect(0, GROUND_Y, canvas.width, 50);
}

function showFinalMessage() {
    canvas.style.transform = "translateX(120px)";
    setTimeout(() => {
        if(textContainer) {
            textContainer.classList.remove('hidden');
            textContainer.style.opacity = "1";
        }
        startTimer();
    }, 1000);
}

function startTimer() {
    const startDate = new Date('2025-09-10T09:35:00');
    function updateTimer() {
        const diff = new Date() - startDate;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        if(contador) contador.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }
    updateTimer();
    setInterval(updateTimer, 1000);
}
