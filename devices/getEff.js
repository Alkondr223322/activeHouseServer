const insolation = [[1.27, 2.06, 3.05, 4.30, 5.44, 5.84, 6.20, 5.34, 4.07, 2.67, 1.55, 1.07, 3.58],
[1.07, 1.89, 2.94, 3.92, 5.19, 5.3, 5.16, 4.68, 3.21, 1.97, 1.10, 0.9, 3.11],
[1.02, 1.77, 2.83, 3.91, 5.05, 5.08, 4.94, 4.55, 3.01, 1.83, 1.05, 0.79, 2.99],
[1.21, 1.99, 2.98, 4.05, 5.55, 5.57, 5.70, 5.08, 3.66, 2.27, 1.20, 0.96, 3.36],
[1.21, 1.99, 2.94, 4.04, 5.48, 5.55, 5.66, 5.09, 3.67, 2.24, 1.23, 0.96, 3.34],
[1.01, 1.82, 2.87, 3.88, 5.16, 5.19, 5.04, 4.66, 3.06, 1.87, 1.04, 0.83, 3.04],
[1.13, 1.91, 3.01, 4.03, 5.01, 5.31, 5.25, 4.82, 3.33, 2.02, 1.19, 0.88, 3.16],
[1.21, 2.00, 2.91, 4.20, 5.62, 5.72, 5.88, 5.18, 3.87, 2.44, 1.25, 0.95, 3.44],
[1.19, 1.93, 2.84, 3.68, 4.54, 4.75, 4.76, 4.40, 3.06, 2.00, 1.20, 0.94, 2.94],
[1.07, 1.87, 2.95, 3.96, 5.25, 5.22, 5.25, 4.67, 3.12, 1.94, 1.02, 0.86, 3.10],
[1.20, 1.95, 2.96, 4.07, 5.47, 5.49, 5.57, 4.92, 3.57, 2.24, 1.14, 0.96, 3.30],
[1.23, 2.06, 3.05, 4.05, 5.46, 5.57, 5.65, 4.99, 3.62, 2.23, 1.26, 0.93, 3.34],
[1.08, 1.83, 2.82, 3.78, 4.67, 4.83, 4.83, 4.45, 3.00, 1.85, 1.06, 0.83, 2.92],
[1.25, 2.10, 3.07, 4.38, 5.65, 5.85, 6.03, 5.34, 3.93, 2.52, 1.36, 1.04, 3.55],
[1.25, 2.11, 3.08, 4.38, 5.65, 5.85, 6.04, 5.33, 3.93, 2.52, 1.36, 1.04, 3.55],
[1.18, 1.96, 3.05, 4.00, 5.40, 5.44, 5.51, 4.87, 3.42, 2.11, 1.15, 0.91, 3.25],
[1.01, 1.81, 2.83, 3.87, 5.08, 5.17, 4.98, 4.58, 3.02, 1.87, 1.04, 0.81, 3.01],
[1.13, 1.93, 3.05, 3.98, 5.27, 5.32, 5.38, 4.67, 3.19, 1.98, 1.10, 0.86, 3.16],
[1.09, 1.86, 2.85, 3.85, 4.84, 5.00, 4.93, 4.51, 3.08, 1.91, 1.09, 0.85, 2.99],
[1.19, 2.02, 3.05, 3.92, 5.38, 5.46, 5.56, 4.88, 3.49, 2.10, 1.19, 0.9, 3.26],
[1.30, 2.13, 3.08, 4.36, 5.68, 5.76, 6.00, 5.29, 4.00, 2.57, 1.36, 1.04, 3.55],
[1.09, 1.86, 2.87, 3.85, 5.08, 5.21, 5.04, 4.58, 3.14, 1.98, 1.10, 0.87, 3.06],
[1.15, 1.91, 2.94, 3.99, 5.44, 5.46, 5.54, 4.87, 3.40, 2.13, 1.09, 0.91, 3.24],
[0.99, 1.80, 2.92, 3.96, 5.17, 5.19, 5.12, 4.54, 3.00, 1.86, 0.98, 0.75, 3.03],
[1.19, 1.93, 2.84, 3.68, 4.54, 4.75, 4.76, 4.40, 3.06, 2.00, 1.20, 0.94, 2.94]]

function dgr(degrees)
{
  const pi = Math.PI;
  return degrees * (pi/180);
}

function eff(hour, azimuthAngle, solarX, solarZ, 
  groundAngle, sunAngle, timeZone, month, region, cloudiness, albedo, day,
  Tref, Gref, ki, kv, Impp, Vmpp, Isc, Voc, Tfm){

  let IGorSum = insolation[region][month]
  let IGorRoz = IGorSum * cloudiness
  let IGorPr = IGorSum - IGorRoz

  let A = Math.sin(dgr(solarX)) * Math.cos(dgr(groundAngle))
  let B = Math.cos(dgr(solarX)) * Math.sin(dgr(groundAngle)) * Math.cos(dgr(azimuthAngle))
  let C = Math.sin(dgr(groundAngle)) * Math.sin(dgr(azimuthAngle))
  let D = Math.cos(dgr(solarX)) * Math.cos(dgr(groundAngle))
  let E = Math.sin(dgr(solarX)) * Math.sin(dgr(groundAngle)) * Math.cos(dgr(azimuthAngle))

  let TuvB = 0.986 * day - 79.866
  let Tuv = 0.11 * Math.sin(dgr(2 * TuvB)) - 0.08 * Math.cos(dgr(TuvB)) - Math.sin(dgr(TuvB))

  let hourSunAngle = 15 * (hour - 12 - Tuv - timeZone) + solarZ
  //console.log('hourSunAngle ' + hourSunAngle)
  let sunRayAngle = Math.acos(Math.abs((A - B) * Math.sin(dgr(sunAngle)) + Math.abs(C * Math.sin(dgr(hourSunAngle)) + (D + E) * Math.cos(dgr(hourSunAngle))) * Math.cos(dgr(sunAngle))))
  let sunZenithAngle = Math.acos(Math.abs(Math.sin(dgr(sunAngle)) * Math.sin(dgr(solarX)) +  Math.cos(dgr(sunAngle)) * Math.cos(dgr(solarX)) * Math.cos(dgr(hourSunAngle))))
  console.log('sunRayAngle ' + sunRayAngle)
  console.log('sunZenithAngle ' + sunZenithAngle)
  let Ibysum = IGorPr * Math.cos(sunRayAngle) / Math.cos(sunZenithAngle) + IGorRoz * (1 + Math.cos(dgr(groundAngle))) / 2 + albedo * IGorSum * (1 - Math.cos(dgr(groundAngle))) / 2
  console.log('cos/cos ' + Math.cos(sunRayAngle) / Math.cos(sunZenithAngle))
  let FF = Impp * Vmpp / (Isc * Voc)
  let CFF = (FF * Tref / Gref) * ((Math.abs(Isc + ki * (Tfm - Tref)) * Math.abs(Isc + kv * (Tfm - Tref))) / Math.log(Math.pow(10, 6) * Gref))
  let result = CFF * Ibysum * Math.log(Math.pow(10, 6) * Ibysum) / Tfm
  return result
}


module.exports= eff