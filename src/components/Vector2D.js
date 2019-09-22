export default class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector2D(this.x, this.y);
    }

    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    scale(factorX, factorY = factorX) {
        this.x *= factorX;
        this.y *= factorY;
        
        if(isNaN(this.magnitude()))
            return new Vector2D();

        return this;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
        return this;
    }

    toString(){
        return `[${this.x}, ${this.y}]`;
    }
}