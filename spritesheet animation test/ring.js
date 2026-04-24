class Ring extends Sprite {
    constructor(x, y) {
        const image = document.getElementById('ringSprite'); // get the ring sprite image element
        
        super({
            image: image,
            x: x,
            y: y,
            spriteWidth: image.width / 4, // assuming 4 frames in the ring sprite sheet
            spriteHeight: image.height, // assuming the sprite sheet is a single row
            scale: 1, // no scaling for the ring
            initialState: 'spin', // initial state for the ring animation
            animations: {
                spin: {
                    row: 0, // row in the sprite sheet for the spin animation
                    maxFrames: 4, // number of frames in the spin animation
                    speed: 12 // animation speed (lower is faster)
                }
            } // Close animations object
        }); // Close config object and super call
    }
}