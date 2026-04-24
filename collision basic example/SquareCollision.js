const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// Square variables

let x = 50; // X position in the canvas
let y = 125; // Y position in the canvas
let size = 75; // Initial size of the square
let speedX = 1; // Speed of the square in the X direction

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    ctx.fillStyle = 'blue'; // Set the fill color to blue
    ctx.fillRect(x, y, size, size); // Draw the square

    // Move the square
    x = x+speedX;

    // Colision logic
    // Collision with right side: x + size > canvas.width
    // Collision with left side: x < 0
    if (x + size > canvas.width || x < 0) {
        // When it detecs a collision, it changes the direction of the square (if it was 5 it becomes -5, if it was -5 it becomes 5)
        speedX = speedX * -1; 
    }

    requestAnimationFrame(animate); // Request the next frame

}

animate(); // Start the animation