function houseControll(
    batterieEnergy, fromHour, toHour, 
    boilerHeat, boilerFuel, boilerHeatPerHour, boilerFuelPerHour, 
    genFuel, genHeat, genHeatPerHour, genFuelPerHour, genEnergyPerHour,
    insideT, outsideT, targetT, 
    solarHeat, 
    //solarHeatPerHour, solarGenPerHour,
    houseEnergyPerHour,pumpEnergyPerHour, pumpHeatPerHour, heatToC,
    airPumpActive, genPumpActive, solarPumpActive, boilerPumpActive,
    azimuthAngle, solarX, solarZ, groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
    Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm, kkd,
    batterieHistory, genHistory, boilerHistory, solarPanelHistory, solarCollectorHistory,
    airPumpHistory, genPumpHistory, solarPumpHistory, boilerPumpHistory, houseConsumptionHistory, houseTempHistory,
    C, M, h, v0, alpha, A, windGenHistory, h0, P,
    houseEnergyConsumptionTable, houseHeatConsumptionTable
){
    const getBoilerInfo = require('./boiler')
    const getGeneratorInfo = require('./fuelGenerator')
    //const getInvertorInfo = require('./getInvertorInfo')
    const getSolarInfo = require('./solar')
    const getheatPumpInfo = require('./heatPump')
    const getWindGenInfo = require('./windGen')

    //let heatNeeded = Math.abs(targetT - insideT) * heatToC
    //let targetHeat = heatNeeded
    //console.log("babat" + targetHeat)

    for(let i = fromHour-1; i <= toHour-1; i++){
        if(i > 23){
            i = 1
            day++
        }
        //let invertorInfo = getInvertorInfo(i, houseEnergyPerHour)
        // получаем трату ЭЭ на этот час
        let invertorInfo = {}
        invertorInfo.houseConsumptionSpeed = houseEnergyConsumptionTable[i]

        let generatorInfo = null // null если не используем генератор, object если да 
        let boilerInfo = null //null если не используем бойлер, object если да 
        //console.log(invertorInfo)
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
        // отработала солнечная панелька
        let solarInfo = getSolarInfo(i, 
            //solarGenPerHour, solarHeatPerHour, 
            azimuthAngle, solarX, solarZ, 
            groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
            Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm, kkd)
        // console.log(i)
        // console.log(solarInfo)
        // нагрели панельку
        solarHeat += solarInfo.solarHeatProduction
        
        // отработал ветрогенератор
        let windGenInfo = getWindGenInfo(C, M, h, v0, alpha, A, outsideT, h0, P, i)


        // если есть излишек - зарядили батарейки
        if (solarInfo.solarEnergyProduction + windGenInfo.windEnergyProduction > invertorInfo.houseConsumptionSpeed){
            batterieEnergy += solarInfo.solarEnergyProduction - invertorInfo.houseConsumptionSpeed + windGenInfo.windEnergyProduction
        // если панельки и ветра не хватает - берем из батарейки
        }else if(batterieEnergy > invertorInfo.houseConsumptionSpeed){
            batterieEnergy -= (invertorInfo.houseConsumptionSpeed - solarInfo.solarEnergyProduction - windGenInfo.windEnergyProduction)
        // если батарейки не хватает - запускаем генератор
        }else{
            generatorInfo = getGeneratorInfo(i, i+1, genEnergyPerHour, genFuelPerHour, genHeatPerHour)
            console.log(generatorInfo)
            genHistory.push(generatorInfo)
            // потребили топливо
            genFuel-= generatorInfo.generatorFuelConsumed
            // нагрели генератор
            genHeat += generatorInfo.totalGeneratorHeatProduction
            // если у генератора есть излишек - зарядили батарейки
            if(generatorInfo.totalGeneratorEnergyProduction > invertorInfo.houseConsumptionSpeed){
                batterieEnergy += generatorInfo.totalGeneratorEnergyProduction - invertorInfo.houseConsumptionSpeed
            }
        }

        // пассивно теряем/получаем тепло
        let passiveHeatConsumption = houseHeatConsumptionTable[i]
        if(insideT > outsideT){
            insideT -= passiveHeatConsumption / heatToC
        }else if (insideT < outsideT){
            insideT += passiveHeatConsumption / heatToC
        }

        // если нужно охладить хату, и снаружи температура ниже 
        if(insideT > outsideT && insideT > targetT){
            let airPump = getheatPumpInfo(i, i+1, pumpEnergyPerHour, pumpHeatPerHour)
            airPumpActive = true
            insideT += airPump.pumpHeatProduced / heatToC
        // если нужно греться
        }else if(insideT < targetT){
            // греемся от атмосферы
            if(insideT < outsideT && insideT < targetT){
                let airPump = getheatPumpInfo(i, i+1, pumpEnergyPerHour, pumpHeatPerHour)
                airPumpActive = true
                insideT += airPump.pumpHeatProduced 
            }
            // догреваемся от панельки
            if(solarHeat > pumpHeatPerHour && insideT < targetT){
                let solarPump = getheatPumpInfo(i, i+1, pumpEnergyPerHour, pumpHeatPerHour)
                solarPumpActive = true
                insideT += solarPump.pumpHeatProduced
                solarHeat -= pumpHeatPerHour
            }
            // догреваемся от генератора
            if(genHeat > pumpHeatPerHour && insideT < targetT){
                let genPump = getheatPumpInfo(i, i+1, pumpEnergyPerHour, pumpHeatPerHour)
                genPumpActive = true
                insideT += genPump.pumpHeatProduced
                genHeat -= pumpHeatPerHour
            }
            // если нужно, включаем бойлер
            if(boilerHeat < pumpHeatPerHour && insideT < targetT){
                boilerInfo = getBoilerInfo(i, i+1, boilerHeatPerHour, boilerFuelPerHour)
                //console.log(boilerInfo)
                boilerHeat += boilerInfo.totalBoilerHeatProduction
                boilerFuel -= boilerInfo.boilerFuelConsumed
            }
            // догреваемся от бойлера
            if(boilerHeat > pumpHeatPerHour && insideT < targetT){
                let boilerPump = getheatPumpInfo(i, i+1, pumpEnergyPerHour, pumpHeatPerHour)
                boilerPumpActive = true
                insideT += boilerPump.pumpHeatProduced
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

        // добавляем все данные в историю
        solarCollectorHistory.push(solarHeat)
        solarPanelHistory.push(solarInfo.solarEnergyProduction)
        batterieHistory.push(batterieEnergy)
        houseConsumptionHistory.push(invertorInfo)
        airPumpHistory.push(airPumpActive)
        genPumpHistory.push(genPumpActive)
        solarPumpHistory.push(solarPumpActive)
        boilerPumpHistory.push(boilerPumpActive)
        genHistory.push(generatorInfo)
        boilerHistory.push(boilerInfo)
        windGenHistory.push(windGenInfo)
        houseTempHistory.push(insideT)

        
    }
    console.log("__________________________________________________________________________________________________________________________________________________")
    return {
        batterieEnergy, fromHour, toHour, 
        boilerHeat, boilerFuel, boilerHeatPerHour, boilerFuelPerHour, 
        genFuel, genHeat, genHeatPerHour, genFuelPerHour, genEnergyPerHour,
        insideT, outsideT, targetT, 
        solarHeat, 
        //solarHeatPerHour, solarGenPerHour,
        houseEnergyPerHour,pumpEnergyPerHour, pumpHeatPerHour, heatToC,
        airPumpActive, genPumpActive, solarPumpActive, boilerPumpActive,
        azimuthAngle, solarX, solarZ, groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
        Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm, kkd,
        batterieHistory, genHistory, boilerHistory, solarPanelHistory, solarCollectorHistory,
        airPumpHistory, genPumpHistory, solarPumpHistory, boilerPumpHistory, houseConsumptionHistory, houseTempHistory,
        C, M, h, v0, alpha, A, windGenHistory, h0, P,
        houseEnergyConsumptionTable, houseHeatConsumptionTable
    }
}

module.exports = houseControll