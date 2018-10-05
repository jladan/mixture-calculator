// Using typescript to handle my definitions
function sq(x) {
    return x * x;
}
var UValue = /** @class */ (function () {
    function UValue(v, u) {
        this.v = v;
        this.u = u;
    }
    UValue.prototype.rel = function () {
        return this.u / this.v;
    };
    UValue.prototype.add = function (y) {
        var v = this.v + y.v;
        var u = Math.sqrt(sq(this.u) + sq(y.u));
        return new UValue(v, u);
    };
    UValue.prototype.sub = function (y) {
        var v = this.v - y.v;
        var u = Math.sqrt(sq(this.u) + sq(y.u));
        return new UValue(v, u);
    };
    UValue.prototype.mul = function (y) {
        var v = this.v * y.v;
        var u = Math.abs(v) * Math.sqrt(sq(this.rel()) + sq(y.rel()));
        return new UValue(v, u);
    };
    UValue.prototype.div = function (y) {
        var v = this.v / y.v;
        var u = Math.abs(v) * Math.sqrt(sq(this.rel()) + sq(y.rel()));
        return new UValue(v, u);
    };
    return UValue;
}());
