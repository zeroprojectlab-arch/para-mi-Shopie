// Canvas setup
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
const textContainer = document.getElementById('texto-regalo');
const contador = document.getElementById('contador');

let state = 'start'; 
let heartY = 250;
let trunkHeight = 0;
let branchesGrown = 0;
const branchData = []; 

const GROUND_Y = 450;
const HEART_START_Y = 200;
const TARGET_HEART_Y = 420;

// RELLENO POR CAPAS (Tu razonamiento humano aplicado)
function prepararArbol() {
    const capas = [
        { escala: 6.5, cantidad: 60, tamaño: 12 }, // Borde exterior
        { escala: 5.0, cantidad: 45, tamaño: 10 }, // Relleno medio
        { escala: 3.5, cantidad: 30, tamaño: 8 },  // Relleno profundo
        { escala: 1.5, cantidad: 15, tamaño: 6 }   // Centro
    ];

    capas.forEach(capa => {
        for(let i = 0; i < capa.cantidad; i++) {
            let t = (i / (capa.cantidad - 1)) * Math.PI * 2;
            let x = 16 * Math.pow(Math.sin(t), 3);
            let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            branchData.push({ 
                dx: x * capa.escala, 
                dy: y * capa.escala, 
                size: capa.tamaño 
            });
        }
    });
}
prepararArbol();

// Iniciar pantalla
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
        heartY = HEART_START_Y + (TARGET_HEART_Y - HEART_START_Y) * (1 - Math.pow(1 - progress, 3));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGround();
        drawHeart(300, heartY, 1 - progress * 0.3, true);
        if (progress < 1) requestAnimationFrame(animate);
        else { state = 'trunk'; animateTrunk(); }
    }
    animate();
}

function animateTrunk() {
    const duration = 2000;
    const startTime = Date.now();
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        trunkHeight = 150 * (1 - Math.pow(1 - progress, 2));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGround();
        drawTrunk(300, GROUND_Y, trunkHeight);
        if (progress < 1) requestAnimationFrame(animate);
        else { state = 'branches'; animateBranches(); }
    }
    animate();
}

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
    ctx.fillStyle = '#ff1a1a'; // El rojo que te gustó
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 10;
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
    const s = 40;
    ctx.moveTo(0, -s/2); ctx.bezierCurveTo(s/2, -s, s, -s/3, 0, s/2);
    ctx.bezierCurveTo(-s, -s/3, -s/2, -s, 0, -s/2);
    ctx.fill();
    ctx.restore();
    if (showText && state === 'start') {
        ctx.font = 'bold 24px Arial'; ctx.fillStyle = 'white'; ctx.textAlign = 'center';
        ctx.fillText('¡PRESÍONAME!', x, y + 60);
    }
}

function drawGround() {
    ctx.fillStyle = '#1a3d1a';
    ctx.fillRect(0, GROUND_Y, canvas.width, 50);
}

function showFinalMessage() {
    canvas.style.transform =
