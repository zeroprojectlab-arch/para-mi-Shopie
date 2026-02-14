// Canvas setup
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
const textContainer = document.getElementById('texto-regalo');
const contador = document.getElementById('contador');

// State management
let state = 'start'; 
let heartY = 250;
let trunkHeight = 0;
let branchesGrown = 0;
const branchData = []; // Aquí guardaremos los corazones para que sean FIJOS

const GROUND_Y = 450;
const HEART_START_Y = 200;
const TARGET_HEART_Y = 420;

function prepararArbol() {
    // Definimos las capas: escala (qué tan grande el corazón), cantidad y tamaño de corazones
    const capas = [
        { escala: 6.0, cantidad: 60, tamaño: 10 }, // Capa 1: El borde (el que ya tienes)
        { escala: 4.5, cantidad: 45, tamaño: 8 },  // Capa 2: Un poco más adentro
        { escala: 3.0, cantidad: 30, tamaño: 6 },  // Capa 3: Más adentro
        { escala: 1.2, cantidad: 15, tamaño: 5 }   // Capa 4: El centro
    ];

    capas.forEach(capa => {
        for(let i = 0; i < capa.cantidad; i++) {
            // Distribuimos los corazones de forma circular en cada capa
            let t = (i / (capa.cantidad - 1)) * Math.PI * 2;
            
            // Ecuación matemática del corazón
            let x = 16 * Math.pow(Math.sin(t), 3);
            let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            
            branchData.push({ 
                dx: x * capa.escala, 
                dy: y * capa.escala, 
                size: capa.tamaño 
            });
        }
    });
}
prepararArbol();
