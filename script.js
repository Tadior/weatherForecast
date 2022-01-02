'use strict';

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';
//const urlCurrent = 'current';
//const urlHistorical = 'historical';
//const urlForecast = 'forecast';
const apiKey = '&appid=69cbf08ca122c19f4ce91ce83efb3893';
const byCity = '?q=';
let currentLocation = 'Moscow';
const metric = '&units=metric'

const cardItems = Array.from(document.querySelectorAll('.card-item'));
const settingsButton = document.getElementById('header-settings');

const cardTypes = cardItems.map(function(item) {
   return item.getAttribute('data-type');
});

function getResponse(url) {
   return fetch(url).then((response) => {return response.json()});
}

function general() {
   getResponse(baseUrl + byCity + currentLocation + metric + apiKey).then((responseValue) => {
      const data = responseValue;

      console.log(data)
      const dataMain = data.main;
      const dataWeather = data.weather[0];

      const weatherPicture = document.querySelector('.weather-picture');

      function setInfo(info) {

         for (let item in info) {
            for (let i of cardItems) {
               if (i.getAttribute('data-type') === item) {
                  console.log(item)
                  i.querySelector('.card-item__value').textContent += info[item];
               }
            }
         }
         document.getElementById('card-status').textContent = getCurrentTime();

         setTemperature(document.querySelector('#card-temperature'), dataMain.temp);
         setTemperature(document.querySelector('#card-temperature'), dataMain.temp);
         setWheatherPicture(dataWeather);
         
      }

      function setTemperature(item, value) {
         item.textContent = value;
      }

      function setWheatherPicture(info) {
         weatherPicture.src = `http://openweathermap.org/img/wn/${info.icon}.png`;
      }

      function getCurrentTime() {
         const date = new Date();
         let out = `${date.getHours()}:${date.getMinutes()}`;
         return out;
      }
      function setDay(time) {
         
      }
      setInfo(dataMain);
      //console.log(new Date().getFullYear())
      //console.log(new Date().())
   });
}  
general();

function settingsMenu() {
   const menu = document.getElementById('settings-menu');
   menu.classList.toggle('show');
   this.classList.toggle('header-settings--pressed');
}
settingsButton.addEventListener('click', settingsMenu);


