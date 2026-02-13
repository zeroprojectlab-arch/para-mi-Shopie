// Fecha: 10 de Septiembre a las 9:35 AM
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

// Esto hace que el reloj corra cada segundo
setInterval(actualizarContador, 1000);

// Dibujamos el árbol de corazones (Simplificado para que funcione de una)
const canvas = document.getElementById('tree');
const ctx = canvas.getContext('2d');
canvas.width = 200;
canvas.height = 200;

// Tronco
ctx.fillStyle = "#4b0082";
ctx.fillRect(95, 120, 10, 60);

// Corazones del árbol (Rosa y Rojo)
function dibujarCorazon(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x - 5, y, 10, 0, Math.PI * 2);
    ctx.arc(x + 5, y, 10, 0, Math.PI * 2);
    ctx.arc(x, y + 5, 10, 0, Math.PI * 2);
    ctx.fill();
}

dibujarCorazon(100, 80, "#ff0055"); // Rojo
dibujarCorazon(130, 100, "#ff4d94"); // Rosa
dibujarCorazon(70, 100, "#ffb3d9"); // Rosa claro
dibujarCorazon(100, 120, "#7a00cc"); // Morado
