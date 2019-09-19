const G = 6.67e-11 * 10e10;

export function newtonGravityLaw(mass1, mass2, distance){
    return G * (mass1*mass2)/(distance*distance);
}

export function distanceBetween(vector1, vector2){
    const distanceVector = vector1.copy().sub(vector2);
    return distanceVector.magntude();
}