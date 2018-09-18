// mixture calculator functions


function combine_two(conc_a, mass_a, conc_b, mass_b) {
    c = conc_a * mass_a + conc_b * mass_b
    return c/ (mass_a + mass_b)
}

function first_mix(solute_mass, water_mass) {
    return solute_mass /  water_mass
}
