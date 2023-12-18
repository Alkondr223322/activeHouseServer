// Котел (выработка ТЭ, потребление топлива)

function getBoilerInfo(fromHour, toHour, 
    //heatPerHour, 
    fuelPerHour,
    boilerFuelType, boilerEff, boilerLoss, boilerHeat){ 
    let fuelQ = [9.5, 7, 4.2, 12]
    let hours = toHour - fromHour
    let heatPerHour = fuelPerHour * fuelQ[boilerFuelType] * boilerEff 
    boilerHeat += heatPerHour / (4.187 * boilerLoss)
    let totalBoilerHeatProduction = heatPerHour / (4.187 * boilerLoss) * hours // kW
    let boilerFuelConsumed = hours * fuelPerHour // l
    
    return {totalBoilerHeatProduction, boilerFuelConsumed, boilerHeat}
}

module.exports = getBoilerInfo