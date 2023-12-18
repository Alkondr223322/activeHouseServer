// Топливная электростанция (выработка ЭЭ, выработка ТЭ, потребление топлива)

function getGeneratorInfo(fromHour, toHour, fuelPerHour, genFuelType, genEffEnergy, genEffHeat, genLoss, genHeat){ 
    let fuelQ = [9.5, 7, 4.2, 12]
    // let genPerHour = fuelPerHour * fuelQ[genFuelType] * genEffEnergy / 3600
    let genPerHour = fuelPerHour * fuelQ[genFuelType] * genEffEnergy 
    let genHeatPerHour = fuelPerHour * fuelQ[genFuelType] * genEffHeat 
    genHeat += genHeatPerHour / (4.187 * genLoss)

    let hours = toHour - fromHour
    let totalGeneratorEnergyProduction = genPerHour * hours // kW
    let generatorFuelConsumed = hours * fuelPerHour // l
    let totalGeneratorHeatProduction =  genHeatPerHour / (4.187 * genLoss) * hours // kw 
    
    return {totalGeneratorEnergyProduction, totalGeneratorHeatProduction, generatorFuelConsumed, genHeat}
}

module.exports = getGeneratorInfo