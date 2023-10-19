// Солнечная электростанция (выработка ЭЭ)

function getSolarGenInfo(power, kkd){ 
    let solarEnergyProduction = 1000 * power * kkd // kW/h
    
    return {solarEnergyProduction}
}
// Солнечный коллектор (выработка ТЭ) 

function getSolarCollectorInfo(power, kkd){ 
    let solarHeatProduction = power * (1 - kkd) // kW/h
    
    return {solarHeatProduction}
}

function getSolarInfo(hour, genPerHour, heatPerHour,  azimuthAngle, solarX, solarZ, 
    groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
    Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm, kkd){
    const getEff = require('./getEff')
    let power = getEff(hour, azimuthAngle, solarX, solarZ, 
        groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
        Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm)
    let solarGen = getSolarGenInfo(power, kkd)
    let solarHeat = getSolarCollectorInfo(power, kkd)
    return {...solarGen, ...solarHeat}
}

module.exports = getSolarInfo