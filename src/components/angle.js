export default class Angle {
    constructor(v=0){
        this.v = v;
    }

    add(angle){
        this.v += angle.v;
        return this;
    }

    set(value){
        this.v = value;
        return this;
    }

    scale(factor){
        this.v *= factor;
        return this;
    }

    copy(){
        return new Angle(this.v);
    }

    sin(){
        return Math.sin(this.v);
    }

    cos(){
        return Math.cos(this.v);
    }
}