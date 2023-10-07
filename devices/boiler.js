// Котел (выработка ТЭ, потребление топлива)

function getBoilerInfo(fromHour, toHour, heatPerHour, fuelPerHour){ 
    let hours = toHour - fromHour
    let totalBoilerHeatProduction = heatPerHour * hours // kW
    let boilerFuelConsumed = hours * fuelPerHour // l
    
    return {totalBoilerHeatProduction, boilerFuelConsumed}
}

module.exports = getBoilerInfo