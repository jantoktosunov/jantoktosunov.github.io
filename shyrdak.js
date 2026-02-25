const canvas = document.getElementById('shyrdakCanvas');
const ctx = canvas.getContext('2d');

// Starting states
let currentBgColor = '#1a1a1a'; // Black
let currentPatternColor = '#e8e6d9'; // Cream
let currentShape = 'intricate';
const shapeSize = 80; 

// Symmetry state
let useSymmetry = document.getElementById('symmetry-toggle').checked;

document.getElementById('symmetry-toggle').addEventListener('change', (e) => {
    useSymmetry = e.target.checked;
});

// --- Initialization & Border Drawing ---
function drawBackground() {
    ctx.save();
    
    // 1. Fill the entire canvas with the Base Felt Color
    ctx.fillStyle = currentBgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Draw the ZigZag Border in the Pattern Color
    ctx.fillStyle = currentPatternColor;
    const borderThickness = 35;
    const zigZagDepth = 15;
    const step = 40;

    ctx.beginPath();
    
    // Draw the outer edge of the canvas
    ctx.rect(0, 0, canvas.width, canvas.height);

    // Draw the inner zigzag path
    ctx.moveTo(0, borderThickness);
    
    // Top border
    for(let x = 0; x <= canvas.width; x += step) {
        ctx.lineTo(x + step/2, borderThickness - zigZagDepth);
        ctx.lineTo(x + step, borderThickness);
    }
    // Right border
    for(let y = 0; y <= canvas.height; y += step) {
        ctx.lineTo(canvas.width - borderThickness + zigZagDepth, y + step/2);
        ctx.lineTo(canvas.width - borderThickness, y + step);
    }
    // Bottom border
    for(let x = canvas.width; x >= 0; x -= step) {
        ctx.lineTo(x - step/2, canvas.height - borderThickness + zigZagDepth);
        ctx.lineTo(x - step, canvas.height - borderThickness);
    }
    // Left border
    for(let y = canvas.height; y >= 0; y -= step) {
        ctx.lineTo(borderThickness - zigZagDepth, y - step/2);
        ctx.lineTo(borderThickness, y - step);
    }
    
    // CRUCIAL FIX: 'evenodd' cuts the zigzag hole out of the outer rectangle
    ctx.fill('evenodd'); 
    ctx.restore();
}

// Initial draw
drawBackground();

// --- Event Listeners (Controls) ---
document.querySelectorAll('#bg-palette .color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('#bg-palette .active').classList.remove('active');
        e.target.classList.add('active');
        currentBgColor = e.target.getAttribute('data-color');
        drawBackground();
    });
});

document.querySelectorAll('#pattern-palette .color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('#pattern-palette .active').classList.remove('active');
        e.target.classList.add('active');
        currentPatternColor = e.target.getAttribute('data-color');
        drawBackground(); 
    });
});

document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.shape-btn.active').classList.remove('active');
        e.target.classList.add('active');
        currentShape = e.target.getAttribute('data-shape');
    });
});

document.getElementById('clear-btn').addEventListener('click', drawBackground);

// --- Drawing Logic with Symmetry ---
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = currentPatternColor;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    drawSelectedShape(x, y);

    if (useSymmetry) {
        const dx = x - centerX;
        const dy = y - centerY;

        // Mirror X
        drawSelectedShape(centerX - dx, y, true, false);
        // Mirror Y
        drawSelectedShape(x, centerY - dy, false, true);
        // Mirror X and Y
        drawSelectedShape(centerX - dx, centerY - dy, true, true);
    }
});

function drawSelectedShape(x, y, flipX = false, flipY = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

    ctx.beginPath();
    if (currentShape === 'diamond') {
        drawDiamond(0, 0, shapeSize);
    } else if (currentShape === 'triangle') {
        drawTriangle(0, 0, shapeSize);
    } else if (currentShape === 'intricate') {
        drawIntricateHorn(0, 0, shapeSize);
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// --- Shape Functions ---
function drawDiamond(x, y, size) {
    ctx.moveTo(x, y - size/2); 
    ctx.lineTo(x + size/2, y); 
    ctx.lineTo(x, y + size/2); 
    ctx.lineTo(x - size/2, y); 
}

function drawTriangle(x, y, size) {
    ctx.moveTo(x, y - size/2); 
    ctx.lineTo(x + size/2, y + size/2); 
    ctx.lineTo(x - size/2, y + size/2); 
}

function drawIntricateHorn(x, y, size) {
    const s = size / 50; 
    ctx.scale(s, s);
    
    ctx.moveTo(0, -25);
    ctx.bezierCurveTo(30, -30, 45, -10, 35, 15); 
    ctx.bezierCurveTo(25, 40, 0, 30, -10, 15);   
    ctx.bezierCurveTo(-15, 5, -5, -5, 5, 0);     
    ctx.bezierCurveTo(15, 5, 20, 15, 10, 20);    
    ctx.bezierCurveTo(5, 22, -20, 25, -25, 5);   
    ctx.bezierCurveTo(-30, -15, -15, -25, 0, -25); 
}