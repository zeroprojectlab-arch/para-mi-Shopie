// 1. CONFIGURACIÓN DE FECHA (10 de Septiembre, 9:35 AM)
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

// 2. CONFIGURACIÓN DEL LIENZO (CANVAS)
const canvas = document.getElementById('tree');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 400;

let animacionIniciada = false;

// Dibujar el corazón-semilla inicial
function dibujarSemilla() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!animacionIniciada) {
        ctx.fillStyle = "#ff4d94";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("❤️", canvas.width / 2, 50);
        ctx.font = "14px Arial";
        ctx.fillText("Toca el corazón", canvas.width / 2, 80);
    }
}

// Función para dibujar una rama que crece
function dibujarRama(x, y, longitud, angulo, grosor) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "#4b0082";
    ctx.lineWidth = grosor;
    ctx.translate(x, y);
    ctx.rotate(angulo * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -longitud);
    ctx.stroke();

    if (longitud < 10) {
        // Al final de la rama, dibujar un corazón (hoja)
        ctx.fillStyle = ["#ff0055", "#ff4d94", "#7a00cc"][Math.floor(Math.random() * 3)];
        ctx.fillText("❤️", 0, -longitud);
        ctx.restore();
        return;
    }

    // Recursividad para crear más ramas
    setTimeout(() => {
        dibujarRama(0, -longitud, longitud * 0.75, angulo - 20, grosor * 0.7);
        dibujarRama(0, -longitud, longitud * 0.75, angulo + 20, grosor * 0.7);
    }, 100);

    ctx.restore();
}

// Al hacer clic: la semilla cae y nace el árbol
canvas.addEventListener('click', () => {
    if (animacionIniciada) return;
    animacionIniciada = true;
    
    // Simular caída
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let ySemilla = 50;
    const intervaloCae = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText("❤️", canvas.width / 2, ySemilla);
        ySemilla += 10;
        if (ySemilla >= 380) {
            clearInterval(intervaloCae);
            dibujarRama(canvas.width / 2, 400, 80, 0, 10); // Empieza a crecer
        }
    }, 20);
});

dibujarSemilla();
