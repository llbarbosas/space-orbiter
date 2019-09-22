export const G = 6.67e-11 * 10e10;

export function newtonGravityLaw(mass1, mass2, distance){
    return G * (mass1*mass2)/(distance*distance);
}  