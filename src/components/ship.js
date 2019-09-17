import Point from './point';

const FPS = 60;
const TURN_SPEED = 360;
const FRICTION = 0.7;
const SHIP_THRUST = 5;

export default class Ship {
    constructor(x, y) {
        this.position = new Point(x, y);
        this.thrust = new Point(0, 0);
        this.isThrusting = false;
        this.size = 10;
        this.radius = 15;
        this.angle = 90 / 180 * Math.PI;
        this.rotation = 0;
    }

    onKeydown = (ev) => {
        switch (ev.keyCode) {
            case 37: // left arrow (rotate ship left)
                this.rotation = TURN_SPEED / 180 * Math.PI / FPS;
                break;
            case 38: // up arrow (thrust the ship forward)
                this.isThrusting = true;
                break;
            case 39: // right arrow (rotate ship right)
                this.rotation = -TURN_SPEED / 180 * Math.PI / FPS;
                break;
            default:
                break;
        }
    }

    onKeyup = (ev) => {
        switch (ev.keyCode) {
            case 37: case 39: // left arrow (stop rotating left)
                this.rotation = 0;
                break;
            case 38: // up arrow (stop thrusting)
                this.isThrusting = false;
                break;
            default:
                break;
        }
    }

    update({ width, height }) {
        if (this.isThrusting) {
            this.thrust.x += SHIP_THRUST * Math.cos(this.angle) / FPS;
            this.thrust.y -= SHIP_THRUST * Math.sin(this.angle) / FPS;
        } else {
            this.thrust.x -= FRICTION * this.thrust.x / FPS;
            this.thrust.y -= FRICTION * this.thrust.y / FPS;
        }

        this.angle += this.rotation;
        this.position.x += this.thrust.x;
        this.position.y += this.thrust.y;

        if (this.position.x < 0 - this.radius) {
            this.position.x = width + this.radius;
        } else if (this.position.x > width + this.radius) {
            this.position.x = 0 - this.radius;
        }
        if (this.position.y < 0 - this.radius) {
            this.position.y = height + this.radius;
        } else if (this.position.y > height + this.radius) {
            this.position.y = 0 - this.radius;
        }

    }

    draw(canvasContext) {
        canvasContext.fillStyle = "white";
        canvasContext.beginPath();
        canvasContext.moveTo( // nose of the ship
            this.position.x + 4 / 3 * this.radius * Math.cos(this.angle),
            this.position.y - 4 / 3 * this.radius * Math.sin(this.angle)
        );
        canvasContext.lineTo( // rear left
            this.position.x - this.radius * (2 / 3 * Math.cos(this.angle) + Math.sin(this.angle)),
            this.position.y + this.radius * (2 / 3 * Math.sin(this.angle) - Math.cos(this.angle))
        );
        canvasContext.lineTo( // rear right
            this.position.x - this.radius * (2 / 3 * Math.cos(this.angle) - Math.sin(this.angle)),
            this.position.y + this.radius * (2 / 3 * Math.sin(this.angle) + Math.cos(this.angle))
        );
        canvasContext.closePath();
        canvasContext.fill();

        canvasContext.fillStyle = "red";
        canvasContext.fillRect(this.position.x - 1, this.position.y - 1, 2, 2);
    }
}