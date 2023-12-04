// Рекуперативный насос (выработка ТЭ*, потребление ЭЭ)

function getVentPumpInfo(fromHour, toHour, energyPerHour, peopleInHouse, airPerPerson, ventPumpEff, insideT, outsideT){ 
    let hours = toHour - fromHour
    
    let airVolume = peopleInHouse * airPerPerson
    let heatNeeded = (Math.abs(insideT - outsideT)) * airVolume / 3600
    let Qrek = heatNeeded * ventPumpEff
    let heatPerHour = heatNeeded - Qrek
    
    let pumpEnergyConsumed = energyPerHour * hours // kW
    let pumpHeatProduced = heatPerHour * hours // kW
    return {pumpEnergyConsumed, pumpHeatProduced, airVolume}
}

module.exports = getVentPumpInfo