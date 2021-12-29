'use strict';

const baseUrl = 'http://api.weatherstack.com/';
const urlCurrent = 'current';
const urlHistorical = 'historical';
const urlForecast = 'forecast';
const apiKey = '?access_key=f52842a7338b67b60edf8e1d1ba9f3d9';
let currentLocation = '&query=Samara';
const cardItems = Array.from(document.querySelectorAll('.card-item'));

const cardTypes = cardItems.map(function(item) {
   return item.getAttribute('data-type');
});

function getResponse(url) {
   return fetch(url).then((response) => {return response.json()});
}

function general(callback) {
   callback(baseUrl + urlCurrent + apiKey + currentLocation).then((responseValue) => {
      const data = responseValue;

      console.log(data)
      const dataCurrent = data.current;

      function setInfoCards(info) {
         for (let item in info) {
            for (let i of cardItems) {
               if (i.getAttribute('data-type') === item) {
                  i.querySelector('.card-item__value').textContent += info[item]
               }
            }
         }
      }
      function setTemperature(item, value) {
         item.textContent = value;
      }

      function setWheatherPicture(info) {
         const compare = info.pop();
         //switch(compare) {
         //   case 'Clear' :
         //      alert(compare);
         //      break;
         //}
      }
      setInfoCards(dataCurrent);

      setTemperature(document.querySelector('#card-temperature'), data.current.temperature);
      setWheatherPicture(data.current.weather_descriptions);
   });
}  
general(getResponse);


