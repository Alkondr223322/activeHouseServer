// Тепловой насос (выработка ТЭ*, потребление ЭЭ)

function getPumpInfo(fromHour, toHour, energyPerHour, heatPerHour){ 
    let hours = toHour - fromHour
    let pumpEnergyConsumed = energyPerHour * hours // kW
    let pumpHeatProduced = heatPerHour * hours // kW
    
    return {pumpEnergyConsumed, pumpHeatProduced}
}

module.exports = getPumpInfo