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

// ESTRUCTURA POR CAPAS (Sin azar)
function prepararArbol() {
    // Definimos 4 capas de relleno, de afuera hacia adentro
    const capas = [
        { escala: 6.5, cantidad: 60, tamaño: 12 }, // Borde exterior
        { escala: 5.0, cantidad: 45, tamaño: 10 }, // Capa media alta
        { escala: 3.5, cantidad: 30, tamaño: 8 },  // Capa media baja
        { escala: 1.5, cantidad: 15, tamaño: 6 }   // Centro (corazones pequeñitos)
    ];

    capas.forEach(capa => {
        for(let i = 0; i < capa.cantidad; i++) {
            let t = (i / (capa.cantidad - 1)) * Math.PI * 2;
            // Ecuación matemática del corazón
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

// ... (Las funciones animateFalling, animateTrunk y animateBranches se mantienen igual)

function drawTrunk(x, baseY, height) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.beginPath();
    ctx.fillStyle = '#4b2c20'; // Café madera fijo
    ctx.moveTo(-20, 0); ctx.lineTo(0, -height); ctx.lineTo(20, 0);
    ctx.fill();
    ctx.restore();
}

function drawBranches(baseX, topY, count) {
    for (let i = 0; i < count; i++) {
        const b = branchData[i];
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(75, 44, 32, 0.1)'; // Ramas muy suaves
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
    ctx.fillStyle = '#ff1a1a'; // Rojo brillante como pediste
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 10;
    ctx.moveTo(0, -size / 2);
    ctx.bezierCurveTo(size / 2, -size, size, -size / 3, 0, size / 2);
    ctx.bezierCurveTo(-size, -size / 3, -size / 2, -size, 0, -size / 2);
    ctx.fill();
    ctx.restore();
}

// ... (Copia las funciones drawHeart, drawGround, showFinalMessage y startTimer de tu código anterior)
