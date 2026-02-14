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
const branchData = []; 

const GROUND_Y = 450;
const HEART_START_Y = 200;
const TARGET_HEART_Y = 420;

function prepararArbol() {
    // 1. EL BORDE (60 corazones para que la forma sea perfecta)
    for(let i=0; i<60; i++) {
        let t = (i / 59) * Math.PI * 2;
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        branchData.push({ dx: x * 6.5, dy: y * 6.5, size: 12, isBorder: true });
    }
    // 2. EL RELLENO (80 corazones esparcidos por TODO el interior)
    for(let i=0; i<80; i++) {
        let t = Math.random() * Math.PI * 2;
        // Este factor 'r' hace que se llenen las "orejas" del corazón
        let r = Math.pow(Math.random(), 0.5) * 0.9; 
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        branchData.push({ 
            dx: x * 6.5 * r, 
            dy: y * 6.5 * r, 
            size: 6 + Math.random() * 10, 
            isBorder: false 
        });
    }
}
prepararArbol();

// ... (El resto de funciones animateFalling y animateTrunk se quedan igual que antes)

function animateBranches() {
    const duration = 4000;
    const startTime = Date.now();
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        branchesGrown = Math.floor(progress * branchData.length);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGround();
        drawTrunk(300, GROUND_Y, trunkHeight);
        drawBranches(300, GROUND_Y - trunkHeight, branchesGrown);
        if (progress < 1) requestAnimationFrame(animate);
        else { state = 'complete'; showFinalMessage(); }
    }
    animate();
}

function drawTrunk(x, baseY, height) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.beginPath();
    ctx.fillStyle = '#4b2c20'; // Café madera
    ctx.moveTo(-20, 0); ctx.lineTo(0, -height); ctx.lineTo(20, 0);
    ctx.fill();
    ctx.restore();
}

function drawBranches(baseX, topY, count) {
    for (let i = 0; i < count; i++) {
        const b = branchData[i];
        ctx.beginPath();
        // Ramas muy claritas para que lo que resalte sean los corazones
        ctx.strokeStyle = 'rgba(75, 44, 32, 0.1)'; 
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
    ctx.fillStyle = '#ff1a1a'; // Rojo brillante
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 10;
    ctx.moveTo(0, -size / 2);
    ctx.bezierCurveTo(size / 2, -size, size, -size / 3, 0, size / 2);
    ctx.bezierCurveTo(-size, -size / 3, -size / 2, -size, 0, -size / 2);
    ctx.fill();
    ctx.restore();
}

// ... (Copia las funciones drawHeart, drawGround, showFinalMessage y startTimer de tu código anterior)
