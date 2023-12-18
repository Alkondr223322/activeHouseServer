// Рекуперативный насос (выработка ТЭ*, потребление ЭЭ)

function getVentPumpInfo(fromHour, toHour, energyPerHour, peopleInHouse, airPerPerson, ventPumpEff, insideT, outsideT, heatToC, targetT){ 
    let hours = toHour - fromHour
    
    let airVolume = peopleInHouse * airPerPerson
    let heatNeeded = (Math.abs(insideT - outsideT)) * airVolume
    let Qrek = heatNeeded * ventPumpEff
    let heatPerHour = heatNeeded - Qrek
    
    let pumpEnergyConsumed = energyPerHour * hours // kW
    let pumpHeatProduced = 0
    if(Math.abs(targetT - insideT) * heatToC < heatPerHour * hours){
        pumpHeatProduced = Math.abs(targetT - insideT) * heatToC // kW
    }else{
        pumpHeatProduced = heatPerHour * hours // kW
    }
    
    console.log(pumpHeatProduced)
    return {pumpEnergyConsumed, pumpHeatProduced, airVolume}
}

module.exports = getVentPumpInfo