import Vector2D from './Vector2D';
import * as physicsHelper from './helpers/physics';

export default class Planet {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D();
        this.acceleration = new Vector2D();

        this.gravity = new Vector2D();

        this.radius = 25;
        this.mass = 1000000;
    }
    
    computeTotalForces(elements) {
        return elements.reduce((forces, element) => forces.add(this.attractionTo(element)), new Vector2D());
    }

    attractionTo(element) {
        if(element === this)
            return new Vector2D();

        const distanceBetweenVector = element.position.copy().sub(this.position);
        const distanceBetween = distanceBetweenVector.magnitude();
        const gravityForce = physicsHelper.newtonGravityLaw(this.mass, element.mass, distanceBetween);
        const gravityForceVector = distanceBetweenVector.normalize().scale(gravityForce);

        return gravityForceVector;
    }

    update({ width, height, timeDifference: TD, gameElements }) {
       this.acceleration = this.computeTotalForces(gameElements).scale(1 / this.mass);
       this.velocity.add(this.acceleration.copy().scale(TD));
       this.position.add(this.velocity.copy().scale(TD));
    }

    draw(canvasContext) {
        canvasContext.fillStyle = "white";
        canvasContext.beginPath();
        canvasContext.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
        canvasContext.fill();
    }
}