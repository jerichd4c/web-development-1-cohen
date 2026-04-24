const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const sonicSprite = document.getElementById('sonicSprite');

// set sprite instances
const sonic = new Sonic(10, 5);
const ring1 = new Ring(245, 10);
const ring2 = new Ring(195, 10);
const ring3 = new Ring(145, 10);
const ring4 = new Ring(95, 10);

// variable to track the current frame of the animation loop
let gameFrame = 0;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas for the next frame

    // draw the sprites though the draw method of the Sprite class
    sonic.draw(ctx, gameFrame);
    ring1.draw(ctx, gameFrame);
    ring2.draw(ctx, gameFrame);
    ring3.draw(ctx, gameFrame);
    ring4.draw(ctx, gameFrame);

    gameFrame++; // increment the game frame for the next animation step
    requestAnimationFrame(animate); // request the next animation frame
}

// event listener to change Sonic state when the spacebar is pressed
canvas.addEventListener('click', () => {
    if (sonic.currentState === 'idle') sonic.setState('run');
    else if (sonic.currentState === 'run') sonic.setState('dash');
    else sonic.setState('idle');
});

// init when the window loads
window.onload = function() {
    animate(); // start the animation loop
}