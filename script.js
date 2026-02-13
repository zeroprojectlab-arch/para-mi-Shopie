// Configuración de vuestra fecha especial: 10 de Septiembre, 9:35 AM
const fechaInicio = new Date('2025-09-10T09:35:00');

function actualizarContador() {
    const ahora = new Date();
    const diferencia = ahora - fechaInicio;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const min = Math.floor((diferencia / 1000 / 60) % 60);
    const seg = Math.floor((diferencia / 1000) % 60);

    document.getElementById('contador').innerHTML = 
        `${dias} días, ${horas} horas, ${min} minutos y ${seg} segundos`;
}
setInterval(actualizarContador, 1000);

// CONFIGURACIÓN DEL ÁRBOL PRO
const canvas = document.getElementById('tree');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

function dibujarCorazon(x, y, tamaño, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - tamaño/2, x - tamaño, y - tamaño/2, x - tamaño, y);
    ctx.bezierCurveTo(x - tamaño, y + tamaño/1.5, x, y + tamaño, x, y + tamaño);
    ctx.bezierCurveTo(x, y + tamaño, x + tamaño, y + tamaño/1.5, x + tamaño, y);
    ctx.bezierCurveTo(x + tamaño, y - tamaño/2, x, y - tamaño/2, x, y);
    ctx.fill();
}

// Dibujar tronco con curvas
ctx.strokeStyle = '#4b0082';
ctx.lineWidth = 8;
ctx.beginPath();
ctx.moveTo(200, 400);
ctx.quadraticCurveTo(200, 300, 200, 200);
ctx.stroke();

// Llenar el árbol de corazones de Sophie (Rojos, Rosas y Morados)
const colores = ['#ff0055', '#ff4d94', '#ffb3d9', '#7a00cc'];
for (let i = 0; i < 50; i++) {
    const x = 200 + (Math.random() - 0.5) * 180;
    const y = 100 + (Math.random() * 150);
    const tam = 5 + Math.random() * 10;
    const col = colores[Math.floor(Math.random() * colores.length)];
    dibujarCorazon(x, y, tam, col);
}
