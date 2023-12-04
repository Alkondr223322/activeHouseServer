// Солнечная электростанция (выработка ЭЭ)

function getSolarGenInfo(power, kkd){ 
    let solarEnergyProduction = power * kkd // kW/h
    
    return {solarEnergyProduction}
}
// Солнечный коллектор (выработка ТЭ) 

function getSolarCollectorInfo(power, kkd, solarLoss){ 
    let solarHeatProduction = power * (1 - kkd) / (4.187 * solarLoss) // kW/h
    
    return solarHeatProduction
}

function getSolarInfo(hour, 
    //genPerHour, heatPerHour,  
    azimuthAngle, solarX, solarZ, 
    groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
    Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm, kkd, solarLoss, solarHeat){
    const getEff = require('./getEff')
    let power = getEff(hour, azimuthAngle, solarX, solarZ, 
        groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
        Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm)
    let solarGen = getSolarGenInfo(power, kkd)
    solarHeat += getSolarCollectorInfo(power, kkd, solarLoss)
    return {...solarGen, solarHeat}
}

module.exports = getSolarInfo