// Особый маусструмент который поможет нам в будущем
// const express = require('express')
// const app = express()
// const port = 3000
function dgr(degrees)
{
  const pi = Math.PI;
  return degrees * (pi/180);
}

const houseControll = require('./devices/houseControll')
let batterieEnergy = 5000 // kw ЭЭ в батарейках 
let fromHour = 1 // h время начала симуляции 
let toHour = 24 // h время конца симуляции 
let boilerHeat = 0 // kw ТЭ в бойлере 
let boilerFuel = 100 //l топливо в бойлере 
let boilerHeatPerHour = 5 // kw/h выработка ТЭ бойлера // const
let boilerFuelPerHour = 1 // l/h потребление топлива бойлером // const
let genFuel = 100 // запас топлива в бойлере
let genHeat = 0 // kw ТЭ в генераторе
let genHeatPerHour = 2 // kw/h выработка ТЭ генератором // const
let genFuelPerHour = 1 // l/h потребление топлива генератором // const
let genEnergyPerHour = 2000 // kw/h выработка ЭЭ генератором // const
let insideT = 18   // C температура в хате
let outsideT = 12 // C температура на улице
let targetT = 24 // C целевая температура в хате
let solarHeat = 0 // kw ТЭ в панельке
//let solarHeatPerHour = 1 // kw/h выработка ТЭ панелькой // deprecated
//let solarGenPerHour = 1500 // kw/h выработка ЭЭ панелькой // deprecated
let houseEnergyPerHour = 3000 // kw/h потребление ЭЭ домом // const
let pumpEnergyPerHour = 150 // kw/h потребление ЭЭ тепловым насосом // const
let pumpHeatPerHour = 1 // kw/h скорость передачи ТЭ тепловым насосом // const
let heatToC = 3 // kw что-бы нагреть хату на 1 градус  // const
let airPumpActive = false // bool работает ли в конкретный час тепловой насос из атмосферы 
let genPumpActive = false // bool работает ли в конкретный час тепловой насос из генератора 
let solarPumpActive = false // bool работает ли в конкретный час тепловой насос из панельки 
let boilerPumpActive = false // bool работает ли в конкретный час тепловой насос из бойлера 
let azimuthAngle = 0 // degree Азимутальний кут установки ( на південь цей кут = 0) // const
let solarX = 20 // degree Широта установки // const
let solarZ = 40 // degree Довгота установки // const
let day = 292 // день від початку року 
let groundAngle = 15  // degree Кут нахилу панелі щодо землі // const
let sunAngle = 23.45 * Math.sin(dgr(0.986 * day + 280.024)) //60 // degree Кутове схилення сонця // const
let timeZone = 3 // hour різниця місцевого часу з Грінвічем в годинах // const
let month = 9 // Номер календарного дня з початку року 
let region = 9 // область України  // const
let cloudiness = 0.3 // [0-1] хмарність 
let Tref = 60 // C температура сонячної панелі в стандартних умовах // const
let Gref = 50 // % освітленість сонячної панелі в стандартних умовах // const
let ki = 0.5 // [0-1] температурні коефіцієнти струму короткого замикання холостого ходу сонячної панелі // const
let kv = 0.8 // [0-1] температурні коефіцієнти напруги холостого ходу сонячної панелі // const
let Impp = 30// Amper паспортні значення струму сонячної панелі у точці максимальної потужності за стандартних умов // const
let Vmpp = 30// Volt паспортні значення напруги сонячної панелі у точці максимальної потужності за стандартних умов // const
let Isc = 10 // Amper паспортні значення струму короткого замикання холостого ходу сонячної панелі за стандартних умов // const
let Voc = 10 // Volt паспортні значення напруги холостого ходу сонячної панелі за стандартних умов
let Tfm = 50 // C температура сонячної панелі 
let kkd = 0.2 // [0-1] ККД перетворювача з контролером максимальної потужності // const
let albedo = 0.5 // [0-1] альбедо до земної поверхні 
let batterieHistory = [] // kw в батарейках в каждый час симуляции
let genHistory = [] // состояние генератора в каждый час симуляции
let boilerHistory = [] // состояние бойлера в каждый час симуляции
let solarPanelHistory = [] // состояние панельки в каждый час симуляции
let solarCollectorHistory = [] // состояние солнечного коллектора в каждый час симуляции
let airPumpHistory = [] // история работы теплового насоса из атмосферы 
let genPumpHistory = [] // история работы теплового насоса из генератора 
let solarPumpHistory = [] // история работы теплового насоса из солнечного коллектора 
let boilerPumpHistory = [] // история работы теплового насоса из бойлера 
let houseConsumptionHistory = [] // потребление энергии домом в каждый час симуляции
let houseTempHistory = [] // температура в доме в каждый час симуляции
let C = 0.3//*в залежності від типу вітряка* 
let M = 29 // г/моль
let h = 10 // висота установки
let v0 = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1] // м/с відома швидкість вітру на висоті h0
let alpha = 0.2 // коеф
let A = 4 // м^2 – площа перетину ротора вітроустановки
let windGenHistory = [] // состояние ветрогенератора в каждый час симуляции
let h0 = 5 // м
let P = 20 // тиск атмосферний 
let houseEnergyConsumptionTable = [0, 1000, 2000, 3000, 4000, 5000, 6000, 5000, 4000, 3000, 2000, 1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 5000, 4000, 3000, 2000, 1000]
let houseHeatConsumptionTable = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1] // kw получаемые/тяремые домом от атмосферы


console.log(houseControll(
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
))

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })