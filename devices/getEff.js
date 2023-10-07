function degrees_to_radians(degrees)
{
  const pi = Math.PI;
  return degrees * (pi/180);
}

function eff(hour){
    let rad = degrees_to_radians(hour * 7.5)
    return Math.sin(rad)
}


module.exports= eff