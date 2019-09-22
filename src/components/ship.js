import Vector2D from './Vector2D';
import Angle from './angle';
import * as canvasHelper from './helpers/canvas';
import * as physicsHelper from './helpers/physics';

const TURN_SPEED = 360;
const FRICTION = 0;
const SHIP_THRUST = 400;

export default class Ship {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D();
        this.acceleration = new Vector2D();
        this.forces = {
            thrust: new Vector2D(),
            friction: new Vector2D(),
            gravity: new Vector2D()
        }
        this.isThrusting = false;

        this.mass = 1;
        this.radius = 15;

        this.angle = new Angle(Math.PI / 2);
        this.rotation = new Angle();

        this.trace = [];
        this.isTracing = false;
    }

    // Key events
    onKeydown = (ev) => {
        switch (ev.keyCode) {
            // Left arrrow
            case 37:
                this.rotation.set(TURN_SPEED / 180 * Math.PI);
                break;

            // Up arrrow
            case 38:
                this.isThrusting = true;
                break;

            // Right arrow
            case 39:
                this.rotation.set(-TURN_SPEED / 180 * Math.PI);
                break;

            // Spacebar
            case 32:
                if(!this.isTracing){
                    this.trace = [];
                    this.isTracing = true;
                } else 
                    this.isTracing = false;
                    
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

    logShipStats() {
        console.log(
            `%cPos: ${this.position}`
            + `\n%cVel: ${this.velocity}`
            + `\n%cAcc: ${this.acceleration}`
            + `\n%cThrust: ${this.forces.thrust}`
            + `\n%cFriction: ${this.forces.friction}`
            + `\n%cGravity: ${this.forces.gravity}`
            + `\n%cResultant: ${this.computeTotalForces()}`,
            "color: red",
            "color: yellow",
            "color: yellowgreen",
            "color: green",
            "color: blue",
            "color: cyan",
            "color: purple"
        );
    }

    // Get the resultant force
    computeTotalForces() {
        return Object.values(this.forces).reduce((forces, force) => forces.add(force), new Vector2D());
    }

    attractionTo(element) {
        if (element === this)
            return new Vector2D();

        const distanceBetweenVector = element.position.copy().sub(this.position);
        const distanceBetween = distanceBetweenVector.magnitude();
        const gravityForce = physicsHelper.newtonGravityLaw(this.mass, element.mass, distanceBetween);
        const gravityForceVector = distanceBetweenVector.normalize().scale(gravityForce);

        return gravityForceVector;
    }

    computeGravity(elements) {
        return elements.reduce((gravity, element) => 
            gravity.add(this.attractionTo(element)),
            new Vector2D()
        );
    }

    update({ width, height, timeDifference: TD, gameElements, Camera }) {
        // Handle thruster and ship friction
        const shipDirection = new Vector2D(this.angle.cos(), -this.angle.sin());

        if (this.isThrusting)
            this.forces.thrust = shipDirection.copy().scale(SHIP_THRUST);
        else
            this.forces.thrust = new Vector2D();

        this.forces.friction = this.velocity.copy().scale(-FRICTION);

        // Gravity
        this.forces.gravity = this.computeGravity(gameElements);

        // Physics 
        this.angle.add(this.rotation.copy().scale(TD));
        this.acceleration = this.computeTotalForces().scale(1 / this.mass);
        this.velocity.add(this.acceleration.copy().scale(TD));
        this.position.add(this.velocity.copy().scale(TD));

        const { left, right, top, bottom } = Camera.getEdges();

        // Handle edge of screen
        if (this.position.x < left)
            Camera.position.x = this.position.x - (Camera.size.x * 0.25);
        if (this.position.x > right)
            Camera.position.x = this.position.x - (Camera.size.x * 0.75);
        if (this.position.y < top)
            Camera.position.y = this.position.y - (Camera.size.y * 0.25);
        if (this.position.x > bottom)
            Camera.position.y = this.position.y - (Camera.size.y * 0.75);

        // Showing info on console
        this.logShipStats();

        if(this.isTracing)
            this.trace.push({ position: this.position.copy(), time: new Date().getMilliseconds()});

    }

    draw(canvasContext) {
        this.drawShip(canvasContext);

        const realThrust = this.position.copy().add(this.forces.thrust);
        const realFriction = this.position.copy().add(this.forces.friction);
        const realVelocity = this.position.copy().add(this.velocity);
        const realGravity = this.position.copy().add(this.forces.gravity);
        const realResultant = this.position.copy().add(this.computeTotalForces());

        this.representForce(canvasContext, realThrust, "green");
        this.representForce(canvasContext, realFriction, "blue");
        this.representForce(canvasContext, realResultant, "purple");
        this.representForce(canvasContext, realVelocity, "yellow");
        this.representForce(canvasContext, realGravity, "cyan");

        canvasHelper.drawCircle(canvasContext, this.position.x, this.position.y, 4, "red");
        this.drawTrace(canvasContext);
    }

    drawTrace(ctx) {
        this.trace.forEach((traceElement, i) => {
            if(this.trace[i+1] !== undefined){
                ctx.strokeStyle = "cyan";
                ctx.beginPath();
                ctx.moveTo(
                    traceElement.position.x,
                    traceElement.position.y
                );
                ctx.lineTo(
                    this.trace[i+1].position.x,
                    this.trace[i+1].position.y
                );
                ctx.stroke();
            }

        /*
            const positionDifference = traceElement.position.copy().sub(this.trace[0].position).magnitude();
            const timeDifference = traceElement.time - this.trace[0].time;

            if(positionDifference > 10 && timeDifference > 1000)
                // ...
        */
        });
    }

    drawShip(ctx) {
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

    representForce(ctx, force, color) {
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