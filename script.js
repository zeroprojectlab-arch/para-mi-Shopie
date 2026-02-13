const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 500;

let ySemilla = 200;
let estado = "ESPERANDO"; // ESPERANDO, CAYENDO, CRECIENDO

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

function mostrarPantallaInicial() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarCorazon(200, ySemilla, 40, "#ff4d94");
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("¡PRESÍONAME!", 200, ySemilla + 80);
}

canvas.addEventListener('click', () => {
    if (estado !== "ESPERANDO") return;
    estado = "CAYENDO";
    
    const caida = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ySemilla += 7;
        dibujarCorazon(200, ySemilla, 15, "#ff4d94");
        
        if (ySemilla >= 450) {
            clearInterval(caida);
            estado = "CRECIENDO";
            // Aquí empezaremos a dibujar el árbol en el siguiente paso
     // 1. Nace el tronco puntiagudo
            dibujarRama(200, 450, 80, 0, 12);
            
            // 2. Mover a la derecha y sacar el texto
            setTimeout(() => {
                canvas.style.transform = "translateX(120px)";
                document.getElementById('texto-regalo').classList.remove('hidden');
                actualizarContador();
                setInterval(actualizarContador, 1000);
            }, 3000);
        }
    }, 20);
});

// 3. FUNCIÓN DEL ÁRBOL PUNTIAGUDO
function dibujarRama(x, y, len, angle, width) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "#4b0082"; 
    ctx.lineWidth = width;
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len); // Esto hace la punta
    ctx.stroke();

    // Si la rama es cortita, pone el corazón (hoja)
    if (len < 10) {
        dibujarCorazon(0, -len, 10, "#ff0055");
        ctx.restore();
        return;
    }

    // Aquí está el truco: la rama crea otras dos ramas (recursividad)
    setTimeout(() => {
        dibujarRama(0, -len, len * 0.75, angle - 25, width * 0.6);
        dibujarRama(0, -len, len * 0.75, angle + 25, width * 0.6);
    }, 100);

    ctx.restore();
}

// Esto debe quedar al final de TODO el archivo
mostrarPantallaInicial();
