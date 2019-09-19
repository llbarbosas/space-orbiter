import Vector2D from './Vector2D';

export default class Planet {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.radius = 50;
    }

    update({ width, height, TimeDifference: TD }) {
        
    }

    draw(canvasContext) {
        canvasContext.fillStyle = "white";
        canvasContext.beginPath();
        canvasContext.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
        canvasContext.fill();
    }
}