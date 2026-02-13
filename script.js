// 1. FECHA EXACTA
const fechaInicio = new Date('2025-09-10T09:35:00');

function actualizarContador() {
    const ahora = new Date();
    const diferencia = ahora - fechaInicio;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const min = Math.floor((diferencia / 1000 / 60) % 60);
    const seg = Math.floor((diferencia / 1000) % 60);
    document.getElementById('contador').innerHTML = `${dias}d ${horas}h ${min}m ${seg}s`;
}
setInterval(actualizarContador, 1000);

// 2. CONFIGURACIÓN DEL ÁRBOL
const canvas = document.getElementById('tree');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 400;

function dibujarArbol(x, y, len, angle, branchWidth) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "#4b0082"; // Color del tronco
    ctx.lineWidth = branchWidth;
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (len < 15) {
        // Dibuja un corazón en las puntas
        ctx.fillStyle = "#ff4d94";
        ctx.font = "12px Arial";
        ctx.fillText("❤️", 0, -len);
        ctx.restore();
        return;
    }

    // Crea las ramas con un poco de retraso para que parezca que crece
    setTimeout(() => {
        dibujarArbol(0, -len, len * 0.75, angle - 25, branchWidth * 0.7);
        dibujarArbol(0, -len, len * 0.75, angle + 25, branchWidth * 0.7);
    }, 50);

    ctx.restore();
}

// 3. INICIO AUTOMÁTICO AL CARGAR
window.onload = () => {
    // El árbol empieza a crecer solo en el centro
    dibujarArbol(canvas.width / 2, 380, 80, 0, 10);
};
