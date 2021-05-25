const farmbotApi = require("../services/farmbotApi"),
    darksky = require("../services/darksky"),
    farmbotControl = require("../services/farmbotControl"),
    settingsService = require("../services/settings");


async function arrosageMain(){
  var plantes = await farmbotApi.plantArray();
  var parcours;
  /*
  * On utilise le module child process pour appeler le programme pyhton directement depuis javascript
  * /

  var spawn = require('child_process').spawn,
      py_process = spawn('python3', ['held_karp_pour_js.py']),
      data = getData();


  /*Le programme python renvoie les index dans l'ordre d'arrosage des points à parcourire
   *
   * A chaque fois qu'on reçoit des données du programme python on ajoute l'index à parcours
   */
  py_process.stdout.on('data', function(data){
    parcours.push(plantes[data])
  });

  /* A la fin du process on renvoie parcours */
  py_process.stdout.on('end', function(){
    return parcours;
  });

  /* stdin.write envoie les données au programme python */
  py_process.stdin.write(data);

  /* Close the stream */
  py_process.stdin.end();

  function getData() {
    var liste =[];
    for (var i in plantes){
      liste.push(toString(i.x) +toString(i.y) +"\n"); // les points sont représentés par une coordonnée x et y
    }
    return liste;
  }
}


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
async function temperature_meteo(){
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
async function proba_precipitation(){
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
  let set = await settingsService.getSettings();
  if(temperature(set.sensorPin) && proba_precipitation() && temperature_meteo() ){
    let waterQuantity = await howMuchWatering(set.waterNeed);
    console.log(waterQuantity);
    let time = await getTime(1,waterQuantity);
    console.log(time);
    let parc = await arrosageMain();
    console.log(parc);
    await farmbotControl.mountWateringNozzle(set.toolID,set.sequenceMountToolID);
    for(let i=0; i<parc.length; i++){
      await farmbotControl.goToPlant(parc[i]);
      await farmbotControl.water(time,set.valvePin); }
      await farmbotControl.unmountWateringNozzle(set.toolID,set.sequenceUnmountToolID);
  }
}
