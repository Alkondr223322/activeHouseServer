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
let boilerHeatPerHour = 5 // kw/h выработка ТЭ бойлера
let boilerFuelPerHour = 1 // l/h потребление топлива бойлером
let genFuel = 100 // запас топлива в бойлере
let genHeat = 0 // kw ТЭ в генераторе
let genHeatPerHour = 2 // kw/h выработка ТЭ генератором
let genFuelPerHour = 1 // l/h потребление топлива генератором
let genEnergyPerHour = 2000 // kw/h выработка ЭЭ генератором
let insideT = 18   // C температура в хате
let outsideT = 12 // C температура на улице
let targetT = 24 // C целевая температура в хате
let solarHeat = 0 // kw ТЭ в панельке
let solarHeatPerHour = 1 // kw/h выработка ТЭ панелькой
let solarGenPerHour = 1500 // kw/h выработка ЭЭ панелькой
let houseEnergyPerHour = 3000 // kw/h потребление ЭЭ домом
let pumpEnergyPerHour = 150 // kw/h потребление ЭЭ тепловым насосом
let pumpHeatPerHour = 1 // kw/h скорость передачи ТЭ тепловым насосом
let heatToC = 3 // kw что-бы нагреть хату на 1 градус 
let airPumpActive = false // работает ли в конкретный час тепловой насос из атмосферы 
let genPumpActive = false // работает ли в конкретный час тепловой насос из генератора 
let solarPumpActive = false // работает ли в конкретный час тепловой насос из панельки 
let boilerPumpActive = false // работает ли в конкретный час тепловой насос из бойлера 
let azimuthAngle = 0 // Азимутальний кут установки ( на південь цей кут = 0)
let solarX = 20 // Широта установки
let solarZ = 40 // Довгота установки
let day = 292 // день від початку року
let groundAngle = 15 // Кут нахилу панелі щодо землі
let sunAngle = 23.45 * Math.sin(dgr(0.986 * day + 280.024)) //60 // Кутове схилення сонця
let timeZone = 3 // різниця місцевого часу з Грінвічем в годинах
let month = 9 // Номер календарного дня з початку року
let region = 9 // область України
let cloudiness = 0.3 // хмарність
let Tref = 60 // температура сонячної панелі в стандартних умовах
let Gref = 50 // освітленість сонячної панелі в стандартних умовах
let ki = 0.5 // температурні коефіцієнти струму короткого замикання холостого ходу сонячної панелі
let kv = 0.8 //  температурні коефіцієнти напруги холостого ходу сонячної панелі
let Impp = 30// паспортні значення струму сонячної панелі у точці максимальної потужності за стандартних умов
let Vmpp = 30// паспортні значення напруги сонячної панелі у точці максимальної потужності за стандартних умов
let Isc = 10 // паспортні значення струму короткого замикання холостого ходу сонячної панелі за стандартних умов
let Voc = 10 // паспортні значення напруги холостого ходу сонячної панелі за стандартних умов
let Tfm = 50 // температура сонячної панелі
let kkd = 0.2 // ККД перетворювача з контролером максимальної потужності
let albedo = 0.5 // альбедо до земної поверхні
console.log(houseControll(
    batterieEnergy, fromHour, toHour, 
    boilerHeat, boilerFuel, boilerHeatPerHour, boilerFuelPerHour, 
    genFuel, genHeat, genHeatPerHour, genFuelPerHour, genEnergyPerHour,
    insideT, outsideT, targetT, 
    solarHeat, solarHeatPerHour, solarGenPerHour,
    houseEnergyPerHour,pumpEnergyPerHour, pumpHeatPerHour, heatToC,
    airPumpActive, genPumpActive, solarPumpActive, boilerPumpActive,
    azimuthAngle, solarX, solarZ, groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
    Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm, kkd
))

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })