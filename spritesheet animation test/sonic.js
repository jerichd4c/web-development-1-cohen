class Sonic extends Sprite {
    constructor(x, y) {
        const image = document.getElementById('sonicSprite'); // get the Sonic sprite image element

        super({
            image: image,
            x: x,
            y: y,
            spriteWidth: image.width / 9, // 9 frames horizontally in the sprite sheet
            spriteHeight: image.height / 3, // 3 frames vertically in the sprite sheet
            scale: 1, // no scaling for Sonic
            initialState: 'idle', // initial state for Sonic animation
            animations: {
                idle: { row: 0, maxFrames: 9, speed: 12 }, // idle animation configuration
                run: { row: 1, maxFrames: 8, speed: 8 }, // run animation configuration
                dash: { row: 2, maxFrames: 4, speed: 6 } // dash animation configuration
            } // close animations object
        }); // close config object and super call
    }
}