import Vector2D from './Vector2D';
import Angle from './angle';
import * as canvasHelper from './helpers/canvas';

const TURN_SPEED = 360;
const FRICTION = 0.3;
const SHIP_THRUST = 80;

export default class Ship {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D();
        this.acceleration = new Vector2D();
        this.forces = {
            thrust: new Vector2D(),
            friction: new Vector2D()
        }
        this.isThrusting = false;
        
        this.mass = 1;
        this.radius = 15;

        this.angle = new Angle(Math.PI/2);
        this.rotation = new Angle();
    }

    // Keys events

    onKeydown = (ev) => {
        switch (ev.keyCode) {
            // Left arrrow key
            case 37:
                this.rotation.set(TURN_SPEED / 180 * Math.PI);
                break;

            // Up arrrow key
            case 38:
                this.isThrusting = true;
                break;

            // Right arrow key
            case 39:
                this.rotation.set(-TURN_SPEED / 180 * Math.PI);
                break;
            default:
                break;
        }
    }

    onKeyup = (ev) => {
        switch (ev.keyCode) {
            case 37: case 39:
                this.rotation.set(0);
                break;
            case 38:
                this.isThrusting = false;
                break;
            default:
                break;
        }
    }

    logShipStats(){
        console.log(
            `%cPos: ${this.position}`
            +`\n%cVel: ${this.velocity}`
            +`\n%cAcc: ${this.acceleration}`
            +`\n%cThrust: ${this.forces.thrust}`
            +`\n%cFriction: ${this.forces.friction}`
            +`\n%cResultant: ${this.computeTotalForces()}`,
            "color: red",
            "color: yellow",
            "color: yellowgreen",
            "color: green",
            "color: blue",
            "color: purple"
        );
    }

    // Get the resultant force
    computeTotalForces(){
        return Object.values(this.forces).reduce((forces, force) => forces.add(force), new Vector2D());
    }

    update({ width, height, TimeDifference: TD }) {
        // Handle thruster and ship friction
        const shipDirection = new Vector2D(this.angle.cos(), -this.angle.sin());

        if (this.isThrusting) 
            this.forces.thrust = shipDirection.copy().scale(SHIP_THRUST);
        else
            this.forces.thrust = new Vector2D();
        
        this.forces.friction = this.velocity.copy().scale(-FRICTION);

        // Physics 
        this.angle.add(this.rotation.copy().scale(TD));
        this.acceleration = this.computeTotalForces().scale(1/this.mass);
        this.velocity.add(this.acceleration.copy().scale(TD));
        this.position.add(this.velocity.copy().scale(TD));

        // Handle edge of screen
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

        // Showing info on console
        this.logShipStats();
    }

    draw(canvasContext) {
        this.drawShip(canvasContext);

        canvasHelper.drawCircle(canvasContext, this.position.x, this.position.y, 4, "red");

        const realThrust = this.position.copy().add(this.forces.thrust.copy().scale(1));
        const realFriction = this.position.copy().add(this.forces.friction.copy().scale(1));
        const realVelocity = this.position.copy().add(this.velocity.copy().scale(1));
        const realResultant = this.position.copy().add(this.computeTotalForces());

        this.representForce(canvasContext, realThrust, "green");
        this.representForce(canvasContext, realFriction, "blue");
        this.representForce(canvasContext, realResultant, "purple");
        this.representForce(canvasContext, realVelocity, "yellow");

    }

    drawShip(ctx){
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo( // nose of the ship
            this.position.x + 4 / 3 * this.radius * this.angle.cos(),
            this.position.y - 4 / 3 * this.radius * this.angle.sin()
        );
        ctx.lineTo( // rear left
            this.position.x - this.radius * (2 / 3 * this.angle.cos() + this.angle.sin()),
            this.position.y + this.radius * (2 / 3 * this.angle.sin() - this.angle.cos())
        );
        ctx.lineTo( // rear right
            this.position.x - this.radius * (2 / 3 * this.angle.cos() - this.angle.sin()),
            this.position.y + this.radius * (2 / 3 * this.angle.sin() + this.angle.cos())
        );
        ctx.closePath();
        ctx.fill();
    }

    representForce(ctx, force, color){
        ctx.fillStyle = color;
        canvasHelper.drawCircle(ctx, force.x, force.y, 3, color);

        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(
            this.position.x,
            this.position.y
        );
        ctx.lineTo(
            force.x,
            force.y
        );
        ctx.closePath();
        ctx.stroke();
    }
}