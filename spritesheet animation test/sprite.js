class Sprite {
    constructor(config) {
        this.image = config.image; // image element
        this.x = config.x || 0; // position horizontally in canvas
        this.y = config.y || 0; // position vertically in canvas
        this.spriteWidth = config.spriteWidth; // width of a single frame in the sprite sheet
        this.spriteHeight = config.spriteHeight; // height of a single frame in the sprite sheet
        this.scale = config.scale || 1; // scale factor for drawing the sprite in the canvas

        this.animations = config.animations || {}; // animation dictionary, if provided
        this.currentState = config.initialState || 'idle'; // initial state for animation
    }

    draw(ctx, gameFrame) {
        const anim = this.animations[this.currentState];
        if (!anim) return; // if no animation for the current state, do not draw

        // infinite loop logic for animation frames
        const currentFrame = Math.floor(gameFrame / anim.speed) % anim.maxFrames;
        const frameX = currentFrame * this.spriteWidth; // X position in the sprite sheet
        const frameY = anim.row * this.spriteHeight; // Y position in the sprite sheet

        ctx.drawImage(
            this.image,
            frameX, frameY, this.spriteWidth, this.spriteHeight, // spritesheet cut
            this.x, this.y, this.spriteWidth * this.scale, this.spriteHeight * this.scale // canvas destiny with scaling
        );
    }

    // method to change the current animation state
    setState(newState) {
        if (this.animations[newState]) {
            this.currentState = newState;
        }
    }
}