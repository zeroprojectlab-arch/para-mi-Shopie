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
            
            // Esto dibuja el tronco puntiagudo
            dibujarRama(200, 450, 120, 0, 20); 

            // Esto mueve el árbol y saca el texto
            setTimeout(() => {
                canvas.style.transform = "translateX(120px)";
                const texto = document.getElementById('texto-regalo');
                if(texto) texto.classList.remove('hidden');
                actualizarContador();
            }, 2000);
        }
