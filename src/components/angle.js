export default class Angle {
    constructor(v = 0) {
        this.v = v;
    }

    add(angle){
        this.v += angle.v;
        return this;
    }

    set(angleValue){
        this.v = angleValue;
        return this;
    }

    sin(){
        return Math.sin(this.v);
    }

    cos(){
        return Math.cos(this.v);
    }
}