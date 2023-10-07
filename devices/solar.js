// Солнечная электростанция (выработка ЭЭ)

function getSolarGenInfo(lightLevel, genPerHour){ 
    let solarEnergyProduction = genPerHour * lightLevel // kW/h
    
    return {solarEnergyProduction}
}
// Солнечный коллектор (выработка ТЭ) 

function getSolarCollectorInfo(lightLevel, heatPerHour){ 
    let solarHeatProduction = heatPerHour * lightLevel // kW/h
    
    return {solarHeatProduction}
}

function getSolarInfo(hour, genPerHour, heatPerHour){
    const getEff = require('./getEff')
    let lightLevel = getEff(hour)
    let solarGen = getSolarGenInfo(lightLevel, genPerHour)
    let solarHeat = getSolarCollectorInfo(lightLevel, heatPerHour)
    return {...solarGen, ...solarHeat}
}

module.exports = getSolarInfo