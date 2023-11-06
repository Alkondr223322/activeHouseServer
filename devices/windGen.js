// Ветрогенератор

function getWindGenInfo(C, M, h, v0, alpha, A, outsideT, h0, P){
    let R = 8.31 
    let windEnergyProduction = C * (M * P * A * Math.pow(v0, 3) * Math.pow(h/h0, 3 * alpha)) / (2 * R * outsideT)
    
    return {windEnergyProduction}
}

module.exports = getWindGenInfo