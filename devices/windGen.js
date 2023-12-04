// Ветрогенератор (выработка ЭЭ)

function getWindGenInfo(C, M, h, v0, alpha, A, outsideT, h0, P, hour){
    let R = 8.31 
    let windEnergyProduction = (C * (M * P * A * Math.pow(v0[hour], 3) * Math.pow(h/h0, 3 * alpha)) / (2 * R * outsideT)) / 1000
    
    return {windEnergyProduction}
}

module.exports = getWindGenInfo