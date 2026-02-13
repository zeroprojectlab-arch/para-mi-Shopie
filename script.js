// 1. CONFIGURACIÓN DE TU FECHA (10 de Septiembre, 9:35 AM)
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

// 2. CONFIGURACIÓN DEL LIENZO
const canvas = document.getElementById('tree');
const ctx = canvas.getContext('2d');
canvas.width = 350;
canvas.height = 400;

let animacionIniciada = false;

// Función para dibujar corazones reales (la usaremos para las hojas y la semilla)
function dibujarCorazon(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - size/2, x - size, y - size/2, x - size, y);
    ctx.bezierCurveTo(x - size, y + size/1.5, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + size, x + size, y + size/1.5, x + size, y);
    ctx.bezierCurveTo(x + size, y - size/2, x, y - size/2, x, y);
    ctx.fill();
}

// 3. LA SEMILLA (El corazón que Sophie debe tocar)
function mostrarSemilla() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibujamos el corazón flotando en el medio
    dibujarCorazon(canvas.width / 2, 100, 20, "#ff4d94");
    
    ctx.fillStyle = "#ffb3d9";
    ctx.font = "16px 'Segoe UI'";
    ctx.textAlign = "center";
    ctx.fillText("Toca el corazón, Sophie", canvas.width / 2, 150);
}

// 4. EL ÁRBOL (Lo que crece después del clic)
function dibujarRama(x, y, len, angle, width) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "#4b0082";
    ctx.lineWidth = width;
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (len < 10) {
        dibujarCorazon(0, -len, 8, "#ff0055");
        ctx.restore();
        return;
    }

    setTimeout(() => {
        dibujarRama(0, -len, len * 0.8, angle - 22, width * 0.7);
        dibujarRama(0, -len, len * 0.8, angle + 22, width * 0.7);
    }, 50);

    ctx.restore();
}

// 5. EVENTO DE CLIC
canvas.addEventListener('click', () => {
    if (animacionIniciada) return; // Evita que crezcan mil árboles si hace clic varias veces
    animacionIniciada = true;
    
    // Limpiamos la semilla y empezamos el árbol desde abajo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarRama(175, 380, 70, 0, 8);
});

// Inicializar al cargar
window.onload = () => {
    actualizarContador();
    mostrarSemilla();
};
