// Using typescript to handle my definitions

function sq(x: number) {
    return x * x;
}

class UValue {
    constructor(public v: number, public u: number) {
    }

    rel() {
        return this.u / this.v;
    }

    add(y: UValue) {
        let v = this.v + y.v;
        let u = Math.sqrt( sq(this.u) + sq(y.u) );
        return new UValue(v, u);
    }

    sub(y: UValue) {
        let v = this.v - y.v;
        let u = Math.sqrt( sq(this.u) + sq(y.u) );
        return new UValue(v, u);
    }

    mul(y: UValue) {
        let v = this.v * y.v;
        let u = Math.abs(v) * Math.sqrt( sq(this.rel()) + sq(y.rel()) );
        return new UValue(v, u);
    }

    div(y: UValue) {
        let v = this.v / y.v;
        let u = Math.abs(v) * Math.sqrt( sq(this.rel()) + sq(y.rel()) );
        return new UValue(v, u);
    }

}

interface mixture {
    c: UValue; // Concentration (in ppm, ideally)
    m: UValue; // Mass (in ppm, ideally)
}

