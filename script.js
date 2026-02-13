const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

// Ajustamos el tamaño para que se vea bien en cualquier cel
canvas.width = 300;
canvas.height = 400;

let ySemilla = 150; // Empezamos más arriba para que se vea el corazón
let semillaCayendo = false;

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

function inicial() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Corazón grande para que Sophie lo vea de una
    dibujarCorazon(150, ySemilla, 30, "#ff4d94"); 
    
    // Texto llamativo
    ctx.fillStyle = "#ffb3d9";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("¡PRESÍONAME!", 150, ySemilla + 60);
}

canvas.addEventListener('click', () => {
    if (semillaCayendo) return;
    semillaCayendo = true;
    
    const animacion = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ySemilla += 5; // Cae suavemente
        
        // Mientras cae, se va haciendo chiquito como una semilla real
        let tamañoActual = 30 - (ySemilla - 150) * 0.1;
        if (tamañoActual < 10) tamañoActual = 10;
        
        dibujarCorazon(150, ySemilla, tamañoActual, "#ff4d94");
        
        // El "suelo" ahora es a los 350 para que se vea en el cuadro
        if (ySemilla >= 350) { 
            clearInterval(animacion);
        }
    }, 20);
});

// Arrancamos la escena
inicial();
