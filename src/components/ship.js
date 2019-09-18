import Vector2D from './vector2d';
import Angle from './angle';

const FPS = 60;
const TURN_SPEED = 360;
const FRICTION = 0.8;
const SHIP_THRUST = 1;
const MAX_ACCELERATION_MAGNITUDE = 50;

export default class Ship {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D();
        this.acceleration = new Vector2D();
        this.forces = new Vector2D();
        
        this.mass = 1;

        this.thrust = 0;
        this.friction = 0;
        this.isThrusting = false;

        this.size = 10;
        this.radius = 15;
        this.angle = new Angle(90 / 180 * Math.PI);
        this.rotation = new Angle();
    }

    onKeydown = (ev) => {
        switch (ev.keyCode) {
            case 37: // left arrow (rotate ship left)
                this.rotation.set(TURN_SPEED / 180 * Math.PI / FPS);
                break;
            case 38: // up arrow (thrust the ship forward)
                this.isThrusting = true;
                break;
            case 39: // right arrow (rotate ship right)
                this.rotation.set(-TURN_SPEED / 180 * Math.PI / FPS);
                break;
            default:
                break;
        }
    }

    onKeyup = (ev) => {
        switch (ev.keyCode) {
            case 37: case 39: // left arrow (stop rotating left)
                this.rotation.set(0);
                break;
            case 38: // up arrow (stop thrusting)
                this.isThrusting = false;
                break;
            default:
                break;
        }
    }

    applyForce(force){
        this.forces.add(force);
    }

    update({ width, height, TimeDifference: dt }) {
        console.log(`Forces: ${this.forces}\nAcc: ${this.acceleration}\nVel: ${this.velocity}\nPosition: ${this.position}`);

        if (this.isThrusting) {
            this.thrust += 0.5;
            this.friction = this.thrust * 0.4;
        } else {
            this.thrust = 0;

            if(this.friction > 0)
                this.friction -= 0.5;
        }

        this.angle.add(this.rotation);

        // this.forces.add(this.thrust).add(this.friction);

        this.acceleration = this.forces.copy().scale(1 / this.mass);

        if (this.acceleration.magnitude() > MAX_ACCELERATION_MAGNITUDE) {
            // this.acceleration.normalize().scale(MAX_ACCELERATION_MAGNITUDE)
            this.acceleration.scale(0)
        }

        this.velocity.add(this.acceleration.copy().scale(dt));
        this.position.add(this.velocity.copy().scale(dt));

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
            this.position.x + 4 / 3 * this.radius * this.angle.cos(),
            this.position.y - 4 / 3 * this.radius * this.angle.sin()
        );
        canvasContext.lineTo( // rear left
            this.position.x - this.radius * (2 / 3 * this.angle.cos() + this.angle.sin()),
            this.position.y + this.radius * (2 / 3 * this.angle.sin() - this.angle.cos())
        );
        canvasContext.lineTo( // rear right
            this.position.x - this.radius * (2 / 3 * this.angle.cos() - this.angle.sin()),
            this.position.y + this.radius * (2 / 3 * this.angle.sin() + this.angle.cos())
        );
        canvasContext.closePath();
        canvasContext.fill();

        canvasContext.fillStyle = "red";
        canvasContext.fillRect(this.position.x - 1, this.position.y - 1, 2, 2);

        const direction = new Vector2D(this.angle.cos(), -this.angle.sin());

        const testThrust = this.position.copy().add(direction.copy().scale(this.thrust));
        const testFriction = this.position.copy().sub(direction.copy().scale(this.friction));

        canvasContext.fillStyle = "green";
        canvasContext.fillRect(testThrust.x, testThrust.y, 5, 5);

        canvasContext.fillStyle = "blue";
        canvasContext.fillRect(testFriction.x, testFriction.y, 5, 5);

        console.log(`Thrust: ${testThrust}\nFriction: ${testFriction}`);
    }
}