import Vector2D from './Vector2D';

export default class Camera{
    constructor(width, heigth, positionX=0, positionY=0){
        this.position = new Vector2D(positionX, positionY);
        this.size = new Vector2D(width, heigth);
    }

    getEdges = () => {
        const left = this.position.x + (this.size.x * 0.25);
        const right = this.position.x + (this.size.x * 0.75);
        const top = this.position.y + (this.size.y * 0.25);
        const bottom = this.position.y + (this.size.y * 0.75);
 
        return { left, right, top, bottom };
    }
}