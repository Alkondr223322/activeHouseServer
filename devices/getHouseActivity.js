function dgr(degrees)
{
  const pi = Math.PI;
  return degrees * (pi/180);
}

function getHouseActivity(hour){

 
    let rad = dgr(hour * 7.5)
    return Math.sin(rad)
}


module.exports= getHouseActivity