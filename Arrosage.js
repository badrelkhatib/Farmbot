 /** * Renvoit (besoin en eau) - (addition des précipitations des 12 prochaines heures) * C'est-à-dire combien de mm d'eau il faut arroser * @param {besoin en eau d'une plante en mm} need */
async function howMuchWatering(need) {
  var tab = await darksky.precipIntensityProba(); 
  var precip = 0; 
  for (let i = 0; i < tab.length; i++) { 
    precip += tab[i]; } 
    var res = need - precip; 
    if (res < 0) {
      return 0; 
    } 
    else { 
      return res; 
    } 
  
} 
/**
* Renvoit le temps d'arrosage nécessaire pour une plante * @param {mm d'eau par seconde de notre pompe} mmPerSec * @param {besoin en eau en mm d'une plante} need 
*/
async function getTime(mmPerSec, need) { 
  let water = await howMuchWatering(need);
  let time = water / mmPerSec; return time; 
  
} 
/** 
* Lit la valeur du capteur d'humidité puis renvoit cette valeur 
*/ 
async function readAndGetSensor(sensorPin) { 
  await farmbotControl.readSoilSensor(sensorPin); 
  let res = await farmbotApi.getLastSensorReading(sensorPin);
  return res; 
}

/**
 * Renvoit Vrai si le taux d'humidité du sol est inférieur au seuil (initialisé à 0.6 dans les réglages) (donc les plantes doivent être arrosé es) 
*/ 
async function isUnderHumidityThreshold(threshold,sensorPin) { 
  let sensor = await readAndGetSensor(sensorPin); 
  let res = 1 - (sensor * 100) / 1023; 
  if (res < threshold) { 
    return true;
    } else { 
    return false; 
  } 
}
  /**
 * Renvoit Vrai si la temperature est entre 0 et 20 degrés à partir du capteur
*/ 
async function temperature(sensorPin) { 
  let sensor = await readAndGetSensor(sensorPin); 
  if (0<sensor && sensor<20 ) { 
    return true;
    } else { 
    return false; 
  } 
}
   /**
 * Renvoit Vrai si la temperature est entre 0 et 20 degrés à partir de l'api meteo  
*/ 
async function temperarture_meteo(){
  var res;
  fetch('https://api.openweathermap.org/data/2.5/weather?q=rennes&appid=d0a4807efedd5fb6822b63f8b351cb43')
.then(Response => Response.json())
.then (data => {
  var temp = data['main']['temp'];
  res = (temp-32)/18
})
if (0<res && res<20 ) { 
    return true;
    } else { 
    return false; 
}
/**
 * Renvoit vrai si l'humidite de l'aire est inferieure à 0,6
*/ 
async function proba_precpitation(){
  var res;
  fetch('https://api.openweathermap.org/data/2.5/weather?q=rennes&appid=d0a4807efedd5fb6822b63f8b351cb43')
.then(Response => Response.json())
.then (data => {
  var humidity = data['main']['humidity'];
  res = humidity
})
 if(res< 60){
    return true
  }else{
    return false
  }
}

} module.exports = async function main() { 
  /* let set = await settingsService.getSettings(); 
  if(isUnderHumidityThreshold(set.humidityThreshold,set.sensorPin)){
    let waterQuantity = await howMuchWatering(set.waterNeed);
    console.log(waterQuantity); 
    let time = await getTime(1,waterQuantity); 
    console.log(time); 
    let parc = await parcours(); 
    console.log(parc); 
    await farmbotControl.mountWateringNozzle(set.toolID,set.sequenceMountToolID); 
    for(let i=0; i<parc.length; i++){ 
      await farmbotControl.goToPlant(parc[i]); 
      await farmbotControl.water(time,set.valvePin); } 
      await farmbotControl.unmountWateringNozzle(set.toolID,set.sequenceUnmountToolID); } */
