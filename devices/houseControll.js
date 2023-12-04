function houseControll(
    batterieEnergy, fromHour, toHour, 
    boilerHeat, boilerFuel, 
    //boilerHeatPerHour, 
    boilerFuelPerHour, 
    genFuel, genHeat, genFuelPerHour,
    //genHeatPerHour, genEnergyPerHour,
    insideT, outsideT, targetT, 
    solarHeat, 
    //solarHeatPerHour, solarGenPerHour,
    houseEnergyPerHour,
    //pumpEnergyPerHour, pumpHeatPerHour, 
    heatToC,
    airPumpActive, genPumpActive, solarPumpActive, boilerPumpActive,
    azimuthAngle, solarX, solarZ, groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
    Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm, kkd,
    batterieHistory, genHistory, boilerHistory, solarPanelHistory, solarCollectorHistory,
    airPumpHistory, genPumpHistory, solarPumpHistory, boilerPumpHistory, houseConsumptionHistory, houseTempHistory,
    C, M, h, v0, alpha, A, windGenHistory, h0, P,
    houseEnergyConsumptionTable, houseHeatConsumptionTable,
    boilerFuelType, boilerEff, boilerLoss,
    genFuelType, genEffEnergy, genEffHeat, genLoss,
    genPumpDiffTable, genPumpLoss, genPumpHeat, genPumpEnergyPerHour, 
    solarPumpDiffTable, solarPumpLoss, solarPumpHeat, solarPumpEnergyPerHour,
    boilerPumpDiffTable, boilerPumpLoss, boilerPumpHeat, boilerPumpEnergyPerHour,
    peopleInHouse, airPerPerson, ventPumpEff, ventEnergyPerHour, solarLoss
){
    const getBoilerInfo = require('./boiler') // симуляція бойлеру
    const getGeneratorInfo = require('./fuelGenerator') // симуляція генератора
    //const getInvertorInfo = require('./getInvertorInfo')
    const getSolarInfo = require('./solar') // симуляція сонячної панелі
    const getheatPumpInfo = require('./heatPump') // симуляція теплових насосів
    const getWindGenInfo = require('./windGen') // симуляція ветрогенератора
    const getVentPumpInfo = require('./ventPump') // симуляція рекуператора

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
        let genPump = null
        let boilerPump = null
        let solarPump = null
        let airPump = null
        //console.log(invertorInfo)
        // если в прошлый час отработал тепловой насос, отнимаем его потребление от общего 
        if(airPumpActive){
            houseEnergyPerHour -= ventEnergyPerHour
            airPumpActive = false
        }
        if(genPumpActive){
            houseEnergyPerHour -= genPumpEnergyPerHour
            genPumpActive = false
        }
        if(solarPumpActive){
            houseEnergyPerHour -= solarPumpEnergyPerHour
            solarPumpActive = false
        }
        if(boilerPumpActive){
            houseEnergyPerHour -= boilerPumpEnergyPerHour
            boilerPumpActive = false
        }
        // отработала солнечная панелька
        let solarInfo = getSolarInfo(i, 
            //solarGenPerHour, solarHeatPerHour, 
            azimuthAngle, solarX, solarZ, 
            groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
            Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm, kkd, solarLoss, solarHeat)
        // console.log(i)
        // console.log(solarInfo)
        // нагрели панельку
        solarHeat = solarInfo.solarHeat
        solarPumpHeat = solarHeat
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
            generatorInfo = getGeneratorInfo(i, i+1, genFuelPerHour, genFuelType, genEffEnergy, genEffHeat, genLoss, genHeat)
            //console.log(generatorInfo)
            genHistory.push(generatorInfo)
            // потребили топливо
            genFuel-= generatorInfo.generatorFuelConsumed
            // нагрели генератор
            genHeat = generatorInfo.genHeat
            genPumpHeat = genHeat
            // если у генератора есть излишек - зарядили батарейки
            if(generatorInfo.totalGeneratorEnergyProduction > invertorInfo.houseConsumptionSpeed){
                batterieEnergy += generatorInfo.totalGeneratorEnergyProduction - invertorInfo.houseConsumptionSpeed
            }
        }

        // пассивно теряем/получаем тепло
        // let passiveHeatConsumption = houseHeatConsumptionTable[i]
        // if(insideT > outsideT){
        //     insideT -= passiveHeatConsumption / heatToC
        // }else if (insideT < outsideT){
        //     insideT += passiveHeatConsumption / heatToC
        // }

        // если нужно охладить хату, и снаружи температура ниже 
        if(insideT > targetT){ // insideT > outsideT && insideT > targetT
            airPump = getVentPumpInfo(i, i+1, ventEnergyPerHour, peopleInHouse, airPerPerson, ventPumpEff, insideT, outsideT)
            airPumpActive = true
            insideT -= airPump.pumpHeatProduced / heatToC
        // если нужно греться
        }else if(insideT < targetT){
            // греемся от атмосферы
            if(insideT < targetT){ // insideT < outsideT && insideT < targetT
                airPump = getVentPumpInfo(i, i+1, ventEnergyPerHour, peopleInHouse, airPerPerson, ventPumpEff, insideT, outsideT)
                airPumpActive = true
                insideT += airPump.pumpHeatProduced / heatToC
            }
            // догреваемся от панельки
            if(solarHeat > 0 && insideT < targetT){
                // fromHour, toHour, energyPerHour, diffTable, pumpLoss, pumpHeat, outsideT
                solarPump = getheatPumpInfo(i, i+1, solarPumpEnergyPerHour, solarPumpDiffTable, solarPumpLoss, solarPumpHeat, insideT)
                solarPumpActive = true
                insideT += solarPump.pumpHeatProduced / heatToC
                //console.log("1: " + solarHeat)
                solarHeat -= solarPump.pumpHeatProduced / heatToC
                // console.log("2: "+solarHeat)
                solarPumpHeat = solarHeat
            }
            // догреваемся от генератора
            if(genHeat > 0 && insideT < targetT){
                genPump = getheatPumpInfo(i, i+1, genPumpEnergyPerHour, genPumpDiffTable, genPumpLoss, genPumpHeat, insideT)
                genPumpActive = true
                insideT += genPump.pumpHeatProduced / heatToC
                genHeat -= genPump.pumpHeatProduced / heatToC
                genPumpHeat = genHeat
            }
            // если нужно, включаем бойлер
            if(boilerHeat <= 0 && insideT < targetT){
                boilerInfo = getBoilerInfo(i, i+1, //boilerHeatPerHour,
                    boilerFuelPerHour, boilerFuelType, boilerEff, boilerLoss, boilerHeat)
                //console.log(boilerInfo)
                boilerHeat = boilerInfo.boilerHeat
                boilerFuel -= boilerInfo.boilerFuelConsumed
                boilerPumpHeat = boilerHeat
            }
            // догреваемся от бойлера
            // console.log("AAAAAAAAAAAAAAAAAAAAAAA")
            // console.log(boilerHeat)
            if(boilerHeat > 0 && insideT < targetT){
                boilerPump = getheatPumpInfo(i, i+1, boilerPumpEnergyPerHour, boilerPumpDiffTable, boilerPumpLoss, boilerPumpHeat, insideT)
                boilerPumpActive = true
                insideT += boilerPump.pumpHeatProduced / heatToC
                boilerHeat -= boilerPump.pumpHeatProduced / heatToC
                boilerPumpHeat = boilerHeat
            }
        }
        // если отработал тепловой насос, добавляем его потребление на следующий час
        if(airPumpActive){
            houseEnergyPerHour += ventEnergyPerHour
        }
        if(genPumpActive){
            houseEnergyPerHour += genPumpEnergyPerHour
        }
        if(solarPumpActive){
            houseEnergyPerHour += solarPumpEnergyPerHour
        }
        if(boilerPumpActive){
            houseEnergyPerHour += boilerPumpEnergyPerHour
        }

        // добавляем все данные в историю
        solarCollectorHistory.push(solarHeat)
        solarPanelHistory.push([ i, solarInfo.solarEnergyProduction])
        batterieHistory.push(batterieEnergy)
        houseConsumptionHistory.push(invertorInfo)
        airPumpHistory.push([airPumpActive, airPump])
        genPumpHistory.push([genPumpActive, genPump])
        solarPumpHistory.push([solarPumpActive, solarPump])
        boilerPumpHistory.push([boilerPumpActive, boilerPump])
        genHistory.push(generatorInfo)
        boilerHistory.push(boilerInfo)
        windGenHistory.push(windGenInfo)
        houseTempHistory.push(insideT)

        
    }
    console.log("__________________________________________________________________________________________________________________________________________________")
    return {
        batterieEnergy, fromHour, toHour, 
        boilerHeat, boilerFuel, 
        //boilerHeatPerHour, 
        boilerFuelPerHour, 
        genFuel, genHeat, genFuelPerHour,
        //genHeatPerHour, genEnergyPerHour,
        insideT, outsideT, targetT, 
        solarHeat, 
        //solarHeatPerHour, solarGenPerHour,
        houseEnergyPerHour,
        //pumpEnergyPerHour, pumpHeatPerHour, 
        heatToC,
        airPumpActive, genPumpActive, solarPumpActive, boilerPumpActive,
        azimuthAngle, solarX, solarZ, groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
        Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm, kkd,
        batterieHistory, genHistory, boilerHistory, solarPanelHistory, solarCollectorHistory,
        airPumpHistory, genPumpHistory, solarPumpHistory, boilerPumpHistory, houseConsumptionHistory, houseTempHistory,
        C, M, h, v0, alpha, A, windGenHistory, h0, P,
        houseEnergyConsumptionTable, houseHeatConsumptionTable,
        boilerFuelType, boilerEff, boilerLoss,
        genFuelType, genEffEnergy, genEffHeat, genLoss,
        genPumpDiffTable, genPumpLoss, genPumpHeat, genPumpEnergyPerHour, 
        solarPumpDiffTable, solarPumpLoss, solarPumpHeat, solarPumpEnergyPerHour,
        boilerPumpDiffTable, boilerPumpLoss, boilerPumpHeat, boilerPumpEnergyPerHour,
        peopleInHouse, airPerPerson, ventPumpEff, ventEnergyPerHour,
        solarLoss
    }
}

module.exports = houseControll