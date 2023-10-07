// Топливная электростанция (выработка ЭЭ, выработка ТЭ, потребление топлива)

function getGeneratorInfo(fromHour, toHour, genPerHour, fuelPerHour, heatPerHour){ 

    let hours = toHour - fromHour
    let totalGeneratorEnergyProduction = genPerHour * hours // kW
    let generatorFuelConsumed = hours * fuelPerHour // l
    let totalGeneratorHeatProduction = heatPerHour * hours // kw 
    
    return {totalGeneratorEnergyProduction, totalGeneratorHeatProduction, generatorFuelConsumed}
}

module.exports = getGeneratorInfo