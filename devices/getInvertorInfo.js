// Инвертор (потребление ЭЭ всех остальных приборов в хате, суммарное потребление за промежуток)

function getInvertorInfo(hour, consumptionPerHour){ 
    const getHouseActivity = require('./getHouseActivity')
    let activityLevel = getHouseActivity(hour)
    let houseConsumptionSpeed = activityLevel * consumptionPerHour // kW/h
    
    return {houseConsumptionSpeed}
}

module.exports = getInvertorInfo