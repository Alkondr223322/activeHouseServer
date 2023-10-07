// Особый маусструмент который поможет нам в будущем
// const express = require('express')
// const app = express()
// const port = 3000

const houseControll = require('./devices/houseControll')
let batterieEnergy = 5000 // kw ЭЭ в батарейках
let fromHour = 6 // h время начала симуляции
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
console.log(houseControll(
    batterieEnergy, fromHour, toHour, 
    boilerHeat, boilerFuel, boilerHeatPerHour, boilerFuelPerHour, 
    genFuel, genHeat, genHeatPerHour, genFuelPerHour, genEnergyPerHour,
    insideT, outsideT, targetT, 
    solarHeat, solarHeatPerHour, solarGenPerHour,
    houseEnergyPerHour,pumpEnergyPerHour, pumpHeatPerHour, heatToC,
    airPumpActive, genPumpActive, solarPumpActive, boilerPumpActive
))

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })