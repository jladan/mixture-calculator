// Using typescript to handle my definitions

function sq(x: number) {
    return x * x;
}

class UValue {
    constructor(public v: number, public u: number) {
    }

    rel() {
        if (this.v == 0) return 0;
        else return this.u / this.v;
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

    times(a: number) {
        return new UValue(a* this.v, Math.abs(a) * this.u);
    }

}

interface Mixture {
    c: UValue; // Concentration (in ppm, ideally)
    m: UValue; // Mass (in g, ideally)
}

/* Make an initial mixture (solid impurity into water)
* The units for both must be the same (i.e. grams)
* Return value in ppm (Mass fraction * 1e6)
*/
function mix_solid(salt: UValue, water: UValue) : Mixture {
    let concentration = salt.div(salt.add(water)).times(1e6);
    let mass = water.add(salt);
    return {c: concentration, m: mass};
}

/* Dilute a mixture with distilled water
*/
function dilute(sol: Mixture, water: UValue) : Mixture {
    let solute = sol.c.mul( sol.m );
    let mass = water.add(sol.m);
    return {c: solute.div(mass), m: water.add(sol.m)}
}

/* Change mass of mixture (as in, pour into a new vessel)
*/
function change_mass(sol: Mixture, new_mass: UValue) {
    return {c: sol.c, m: new_mass};
}

/* Pour off some mass of a mixture 
* i.e. What's left
*/
function split_mass(sol: Mixture, lost_mass: UValue) {
    return {c: sol.c, m: sol.m.sub(lost_mass) };
}

/* Combine two mixtures
* The units should match (e.g. both ppm), and are mass-fraction (not ratio)
* Calculaiton: c1*m1 + c2*m2
*              -------------
*                 m1 + m2
*/
function mix_two(sol1: Mixture, sol2: Mixture) : Mixture {
    let solute = sol1.c.mul(sol2.m).add( sol2.c.mul(sol2.m) );
    let mass = sol1.m.add(sol2.m);
    return {c: solute.div(mass), m: mass};
}

/********* The app's actual code *************/
var register;
var regMassElem;
var regConcElem;

function output_register() {
    regMassElem.innerText = `${register.m.v} +- ${register.m.u} g`;
    regConcElem.innerText = `${register.c.v} +- ${register.c.u} salt`;
}

var saltElem;
var usaltElem;

var waterElem;
var uwaterElem;

function setElements() {
    saltElem = document.getElementById('salt');
    usaltElem = document.getElementById('usalt');

    waterElem = document.getElementById('water');
    uwaterElem = document.getElementById('uwater');

    regMassElem = document.getElementById('reg-mass');
    regConcElem = document.getElementById('reg-concentration');
}

function mix_button() {
    let salt = new UValue(saltElem.valueAsNumber*1e-3, usaltElem.valueAsNumber*1e-3);
    let water = new UValue(waterElem.valueAsNumber, uwaterElem.valueAsNumber);
    register = mix_solid(salt, water);
    output_register();
}

function subtract_button() {
    let water = new UValue(waterElem.valueAsNumber, uwaterElem.valueAsNumber);
    register = split_mass(register, water);
    output_register();
}

function set_mass_button() {
    let water = new UValue(waterElem.valueAsNumber, uwaterElem.valueAsNumber);
    register = change_mass(register, water);
    output_register();
}

function dilute_button() {
    let water = new UValue(waterElem.valueAsNumber, uwaterElem.valueAsNumber);
    register = dilute(register, water);
    output_register();
}

