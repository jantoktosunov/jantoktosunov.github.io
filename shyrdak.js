// --- Configuration & State ---
const canvas = document.getElementById('shyrdakCanvas');
const ctx = canvas.getContext('2d'); // The "brush" we use to draw

// Default starting states
let currentBgColor = '#3e2723';
let currentPatternColor = '#c62828';
let currentShape = 'diamond';
const shapeSize = 60; // The general size of the stamps

// --- Initialization ---

// Function to fill the canvas background
function drawBackground() {
    // Store the current drawing state before filling background
    ctx.save();
    ctx.fillStyle = currentBgColor;
    // Fill the entire rectangle of the canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Restore state
    ctx.restore();
}

// Draw the initial background immediately upon loading
drawBackground();


// --- Event Listeners (Controls) ---

// 1. Background Color Pickers
document.querySelectorAll('#bg-palette .color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove 'active' class from previous button
        document.querySelector('#bg-palette .active').classList.remove('active');
        // Add 'active' to clicked button
        e.target.classList.add('active');
        // Update state variable
        currentBgColor = e.target.getAttribute('data-color');
        // Redraw background (warning: this clears existing shapes, traditional for felt work)
        drawBackground();
    });
});

// 2. Pattern Color Pickers
document.querySelectorAll('#pattern-palette .color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('#pattern-palette .active').classList.remove('active');
        e.target.classList.add('active');
        currentPatternColor = e.target.getAttribute('data-color');
    });
});

// 3. Shape Pickers
document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.shape-btn.active').classList.remove('active');
        e.target.classList.add('active');
        currentShape = e.target.getAttribute('data-shape');
    });
});

// 4. Clear Button
document.getElementById('clear-btn').addEventListener('click', drawBackground);


// --- Drawing Logic (The core game mechanic) ---

// Listen for clicks on the canvas itself
canvas.addEventListener('mousedown', (e) => {
    // Get the position of the canvas relative to the browser window
    const rect = canvas.getBoundingClientRect();
    // Calculate the exact X and Y coordinates of the mouse click on the canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set the drawing color for the shape
    ctx.fillStyle = currentPatternColor;

    // Start a new drawing path
    ctx.beginPath();

    // Decide which shape to draw based on current state
    if (currentShape === 'diamond') {
        drawDiamond(x, y, shapeSize);
    } else if (currentShape === 'triangle') {
        drawTriangle(x, y, shapeSize);
    } else if (currentShape === 'horn') {
        drawHorn(x, y, shapeSize);
    }

    // Close the path and fill it with color
    ctx.closePath();
    ctx.fill();
});


// --- Helper functions to draw specific shapes ---

// Helper function to draw a Diamond (Rhombus)
function drawDiamond(x, y, size) {
    ctx.moveTo(x, y - size/2); // Top point
    ctx.lineTo(x + size/2, y); // Right point
    ctx.lineTo(x, y + size/2); // Bottom point
    ctx.lineTo(x - size/2, y); // Left point
}

// Helper function to draw a Triangle
function drawTriangle(x, y, size) {
    ctx.moveTo(x, y - size/2); // Top point
    ctx.lineTo(x + size/2, y + size/2); // Bottom right
    ctx.lineTo(x - size/2, y + size/2); // Bottom left
}

// Helper function to draw a simplified "Ram's Horn" motif using curves
function drawHorn(centerX, centerY, size) {
    // This uses Bezier curves to create a curled shape.
    // It's a simplified representation of the complex traditional patterns.
    const startX = centerX - size / 2;
    const startY = centerY + size / 4;
    
    ctx.moveTo(startX, startY);
    // Curve up and right
    ctx.bezierCurveTo(startX, centerY - size, centerX + size, centerY - size, centerX + size, centerY);
    // Curve down and curled back in
    ctx.bezierCurveTo(centerX + size, centerY + size/1.5, centerX, centerY + size/2, centerX, centerY);
    // Curve back out to complete the shape thick in the middle
    ctx.bezierCurveTo(centerX - size/4, centerY + size/2, startX + size/4, startY + size/4, startX, startY);
}