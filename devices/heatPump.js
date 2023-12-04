// Тепловой насос (выработка ТЭ*, потребление ЭЭ)

function getPumpInfo(fromHour, toHour, energyPerHour, diffTable, pumpLoss, pumpHeat, outsideT){ 
    let hours = toHour - fromHour
    let koef = 0
    if(Math.abs(pumpHeat - outsideT) >= diffTable.length){
        koef = diffTable[diffTable.length-1]
    }else{
        koef = diffTable[Math.floor(Math.abs(pumpHeat - outsideT))]
    }
    let heatPerHour = energyPerHour * koef
    pumpHeat += heatPerHour / (4.187 * pumpLoss)
    let pumpEnergyConsumed = energyPerHour * hours // kW
    let pumpHeatProduced = heatPerHour / (4.187 * pumpLoss) * hours // kW
    return {pumpEnergyConsumed, pumpHeatProduced, pumpHeat}
}

module.exports = getPumpInfo