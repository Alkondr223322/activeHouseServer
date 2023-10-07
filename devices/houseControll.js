function houseControll(
    batterieEnergy, fromHour, toHour, 
    boilerHeat, boilerFuel, boilerHeatPerHour, boilerFuelPerHour, 
    genFuel, genHeat, genHeatPerHour, genFuelPerHour, genEnergyPerHour,
    insideT, outsideT, targetT, 
    solarHeat, solarHeatPerHour, solarGenPerHour,
    houseEnergyPerHour,pumpEnergyPerHour, pumpHeatPerHour, heatToC,
    airPumpActive, genPumpActive, solarPumpActive, boilerPumpActive
){
    const getBoilerInfo = require('./boiler')
    const getGeneratorInfo = require('./fuelGenerator')
    const getInvertorInfo = require('./getInvertorInfo')
    const getSolarInfo = require('./solar')
    const getheatPumpInfo = require('./heatPump')

    let heatNeeded = Math.abs(targetT - insideT) * heatToC
    let targetHeat = heatNeeded

    for(let i = fromHour; i <= toHour; i++){
        if(i > 24){
            i = 1
        }
        let invertorInfo = getInvertorInfo(i, houseEnergyPerHour)
        console.log(invertorInfo)
        // если в прошлый час отработал тепловой насос, отнимаем его потребление от общего 
        if(airPumpActive){
            houseEnergyPerHour -= pumpEnergyPerHour
            airPumpActive = false
        }
        if(genPumpActive){
            houseEnergyPerHour -= pumpEnergyPerHour
            genPumpActive = false
        }
        if(solarPumpActive){
            houseEnergyPerHour -= pumpEnergyPerHour
            solarPumpActive = false
        }
        if(boilerPumpActive){
            houseEnergyPerHour -= pumpEnergyPerHour
            boilerPumpActive = false
        }
        let solarInfo = getSolarInfo(i, solarGenPerHour, solarHeatPerHour)
        console.log(solarInfo)
        // нагрели панельку
        solarHeat += solarInfo.solarHeatProduction
        // если есть излишек - зарядили батарейки
        if (solarInfo.solarEnergyProduction > invertorInfo.houseConsumptionSpeed){
            batterieEnergy += solarInfo.solarEnergyProduction - invertorInfo.houseConsumptionSpeed
        // если панельки н ехватает - берем из батарейки
        }else if(batterieEnergy > invertorInfo.houseConsumptionSpeed){
            batterieEnergy -= invertorInfo.houseConsumptionSpeed
        // если батарейки не хватает - запускаем генератор
        }else{
            let generatorInfo = getGeneratorInfo(i, i+1, genEnergyPerHour, genFuelPerHour, genHeatPerHour)
            console.log(generatorInfo)
            // потребили топливо
            genFuel-= generatorInfo.generatorFuelConsumed
            // нагрели генератор
            genHeat += generatorInfo.totalGeneratorHeatProduction
            // если у генератора есть излишек - зарядили батарейки
            if(generatorInfo.totalGeneratorEnergyProduction > invertorInfo.houseConsumptionSpeed){
                batterieEnergy += generatorInfo.totalGeneratorEnergyProduction - invertorInfo.houseConsumptionSpeed
            }
        }

        // если нужно охладить хату, и снаружи температура ниже 
        if(targetT < insideT && insideT > outsideT){
            let airPump = getheatPumpInfo(i, i+1, pumpEnergyPerHour, pumpHeatPerHour)
            airPumpActive = true
            heatNeeded -= airPump.pumpHeatProduced
        // если нужно греться
        }else if(targetT > insideT){
            // греемся от атмосферы
            if(insideT < outsideT && heatNeeded > 0){
                let airPump = getheatPumpInfo(i, i+1, pumpEnergyPerHour, pumpHeatPerHour)
                airPumpActive = true
                heatNeeded -= airPump.pumpHeatProduced
            }
            // догреваемся от панельки
            if(solarHeat > pumpHeatPerHour && heatNeeded > 0){
                let solarPump = getheatPumpInfo(i, i+1, pumpEnergyPerHour, pumpHeatPerHour)
                solarPumpActive = true
                heatNeeded -= solarPump.pumpHeatProduced
                solarHeat -= pumpHeatPerHour
            }
            // догреваемся от генератора
            if(genHeat > pumpHeatPerHour && heatNeeded > 0){
                let genPump = getheatPumpInfo(i, i+1, pumpEnergyPerHour, pumpHeatPerHour)
                genPumpActive = true
                heatNeeded -= genPump.pumpHeatProduced
                genHeat -= pumpHeatPerHour
            }
            // если нужно, включаем бойлер
            if(boilerHeat < pumpHeatPerHour && heatNeeded > 0){
                let boilerInfo = getBoilerInfo(i, i+1, boilerHeatPerHour, boilerFuelPerHour)
                console.log(boilerInfo)
                boilerHeat += boilerInfo.totalBoilerHeatProduction
                boilerFuel -= boilerInfo.boilerFuelConsumed
            }
            // догреваемся от бойлера
            if(boilerHeat > pumpHeatPerHour && heatNeeded > 0){
                let boilerPump = getheatPumpInfo(i, i+1, pumpEnergyPerHour, pumpHeatPerHour)
                boilerPumpActive = true
                heatNeeded -= boilerPump.pumpHeatProduced
                boilerHeat -= pumpHeatPerHour
            }
        }
        // если отработал тепловой насос, добавляем его потребление на следующий час
        if(airPumpActive){
            houseEnergyPerHour += pumpEnergyPerHour
        }
        if(genPumpActive){
            houseEnergyPerHour += pumpEnergyPerHour
        }
        if(solarPumpActive){
            houseEnergyPerHour += pumpEnergyPerHour
        }
        if(boilerPumpActive){
            houseEnergyPerHour += pumpEnergyPerHour
        }
    }
    // переводим тепло обратно в градусы
    let resultHeat = (targetHeat - heatNeeded) / heatToC // C
    if(targetT < insideT){
        insideT -= resultHeat  
    }else if(targetT > insideT){
        insideT += resultHeat
    }
    return {
        batterieEnergy, fromHour, toHour, 
        boilerHeat, boilerFuel, boilerHeatPerHour, boilerFuelPerHour, 
        genFuel, genHeat, genHeatPerHour, genFuelPerHour, genEnergyPerHour,
        insideT, outsideT, targetT, 
        solarHeat, solarHeatPerHour, solarGenPerHour,
        houseEnergyPerHour,pumpEnergyPerHour, pumpHeatPerHour, heatToC,
        airPumpActive, genPumpActive, solarPumpActive, boilerPumpActive
    }
}

module.exports = houseControll