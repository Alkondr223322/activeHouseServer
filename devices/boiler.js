// Котел (выработка ТЭ, потребление топлива)

function getBoilerInfo(fromHour, toHour, 
    //heatPerHour, 
    fuelPerHour,
    boilerFuelType, boilerEff, boilerLoss, boilerHeat){ 
    let fuelQ = [9.5, 7, 4.2, 12]
    let hours = toHour - fromHour
    let heatPerHour = fuelPerHour * fuelQ[boilerFuelType] * boilerEff / 3600
    boilerHeat += 3600 * heatPerHour / (4.187 * boilerLoss)
    let totalBoilerHeatProduction = 3600 * heatPerHour / (4.187 * boilerLoss) * hours // kW
    let boilerFuelConsumed = hours * fuelPerHour // l
    
    return {totalBoilerHeatProduction, boilerFuelConsumed, boilerHeat}
}

module.exports = getBoilerInfo