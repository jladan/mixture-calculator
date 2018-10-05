// Using typescript to handle my definitions

interface uvalue {
    v:  number; // value
    u:  number; // uncertainty
}

interface mixture {
    c: uvalue; // Concentration (in ppm, ideally)
    m: uvalue; // Mass (in ppm, ideally)
}

function sq(x: number) {
    return x * x;
}

class UValue {
    v: Number;
    u: Number;
    contructor(v: number, u: number) {
        this.v = v;
        this.u = u;
    }

    rel() {
        return this.u / this.v;
    }

    function add(y: uvalue) {
        let v = this.v + y.v;
        let u = Math.sqrt( sq(this.u) + sq(y.u) );
        return new UValue(v, u);
    }

    function sub(y: uvalue) {
        let v = this.v - y.v;
        let u = Math.sqrt( sq(this.u) + sq(y.u) );
        return new UValue(v, u);
    }

    function mul(y: uvalue) {
        let v = this.v * y.v;
        let u = Math.abs(v) * Math.sqrt( sq(this.rel()) + sq(y.rel()) );
        return new UValue(v, u);
    }

    function div(y: uvalue) {
        let v = this.v / y.v;
        let u = Math.abs(v) * Math.sqrt( sq(this.rel()) + sq(y.rel()) );
        return new UValue(v, u);
    }

}
