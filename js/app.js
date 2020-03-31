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
        if (this.v == 0)
            return 0;
        else
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
    UValue.prototype.times = function (a) {
        return new UValue(a * this.v, Math.abs(a) * this.u);
    };
    return UValue;
}());
/* Make an initial mixture (solid impurity into water)
* The units for both must be the same (i.e. grams)
* Return value in ppm (Mass fraction * 1e6)
*/
function mix_solid(salt, water) {
    var concentration = salt.div(salt.add(water)).times(1e6);
    var mass = water.add(salt);
    return { c: concentration, m: mass };
}
/* Dilute a mixture with distilled water
*/
function dilute(sol, water) {
    var solute = sol.c.mul(sol.m);
    var mass = water.add(sol.m);
    return { c: solute.div(mass), m: water.add(sol.m) };
}
/* Pour off some mass of a mixture
* i.e. What's left
*/
function split_mass(sol, lost_mass) {
    return { c: sol.c, m: sol.m.sub(lost_mass) };
}
/* Combine two mixtures
* The units should match (e.g. both ppm), and are mass-fraction (not ratio)
* Calculaiton: c1*m1 + c2*m2
*              -------------
*                 m1 + m2
*/
function mix_two(sol1, sol2) {
    var solute = sol1.c.mul(sol1.m).add(sol2.c.mul(sol2.m));
    var mass = sol1.m.add(sol2.m);
    return { c: solute.div(mass), m: mass };
}
/********* The app's actual code *************/
var regMassElem;
var regConcElem;
var saltElem, usaltElem;
var waterElem, uwaterElem, massElem, umassElem;
var solElem, usolElem, solMassElem, usolMassElem;
function outputSolution(register) {
    solElem.value = register.c.v; usolElem.value = register.c.u;
    solMassElem.value = register.m.v; usolMassElem.value = register.m.u;
    regMassElem.innerText = register.m.v + " +- " + register.m.u + " g";
    regConcElem.innerText = register.c.v + " +- " + register.c.u + " salt";
}
function setElements() {
    // Salt crystals
    saltElem = document.getElementById('salt');
    usaltElem = document.getElementById('usalt');
    // Dye/water
    waterElem = document.getElementById('water-ppm');
    uwaterElem = document.getElementById('uwater-ppm');
    massElem = document.getElementById('water-mass');
    umassElem = document.getElementById('uwater-mass');
    // Mixed solution
    solElem = document.getElementById('sol-ppm');
    usolElem = document.getElementById('usol-ppm');
    solMassElem = document.getElementById('sol-mass');
    usolMassElem = document.getElementById('usol-mass');
    // Output
    regMassElem = document.getElementById('reg-mass');
    regConcElem = document.getElementById('reg-concentration');
}
function getSolution() {
    sol = {};
    sol.c = new UValue(solElem.valueAsNumber, usolElem.valueAsNumber);
    sol.m = new UValue(solMassElem.valueAsNumber, usolMassElem.valueAsNumber);
    return sol;
}
function getWater() {
    var water = {};
    water.c = new UValue(waterElem.valueAsNumber, uwaterElem.valueAsNumber);
    water.m = new UValue(massElem.valueAsNumber, umassElem.valueAsNumber);
    return water;
}
function mix_salt_button() {
    var salt = new UValue(saltElem.valueAsNumber * 1e-3, usaltElem.valueAsNumber * 1e-3);
    var water = new UValue(massElem.valueAsNumber, umassElem.valueAsNumber);
    sol = mix_solid(salt, water);
    outputSolution(sol);
}
function subtract_button() {
    var mass = new UValue(massElem.valueAsNumber, umassElem.valueAsNumber);
    sol = split_mass(getSolution(), mass);
    outputSolution(sol);
}
function mix_button() {
    sol = mix_two(getSolution(), getWater());
    outputSolution(sol);
}
function dilute_button() {
    var mass = new UValue(massElem.valueAsNumber, umassElem.valueAsNumber);
    sol = dilute(getSolution(), mass);
    outputSolution(sol);
}
