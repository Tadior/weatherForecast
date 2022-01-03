'use strict';

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';
//const urlCurrent = 'current';
//const urlHistorical = 'historical';
//const urlForecast = 'forecast';
const apiKey = '';
const byCity = '?q=';
let currentLocation = 'Moscow';
const metric = '&units=metric';

const cardItems = Array.from(document.querySelectorAll('.card-item'));
const settingsButton = document.getElementById('header-settings');

const cardTypes = cardItems.map(function(item) {
   return item.getAttribute('data-type');
});

function getResponse(url) {
   return fetch(url).then((response) => {return response.json()});
}

function general(requestUrl) {
   getResponse(requestUrl).then((responseValue) => {
      const data = responseValue;
      if (!data.main) {
         alert(data.message);
         return false;
      }
      console.log(data)
      const dataMain = data.main;
      const dataWeather = data.weather[0];
      const timezone = data.timezone;

      const weatherPicture = document.querySelector('.weather-picture');

      function setInfo(info) {

         for (let item in info) {
            for (let i of cardItems) {
               if (i.getAttribute('data-type') === item) {
                  i.querySelector('.card-item__value').textContent = info[item];
               }
            }
         }

         setExtraInfo(document.querySelector('#card-temperature'), dataMain.temp);
         setExtraInfo(document.querySelector('#card-city'), data.name);
         setExtraInfo(document.getElementById('card-status'), getCurrentTime(timezone));
         setWheatherPicture(dataWeather);
         setDay(getCurrentTime(timezone));
      }

      function setExtraInfo(item, value) {
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
         const timeArr = time.split(':');
         const hours = timeArr[0];
         const element = document.querySelector("[data-type='is_day']");
         let out = '';
         if (hours >= 0 && hours < 6 ) out = 'Ночь';
         if (hours >= 6 && hours < 12 ) out = 'Утро';
         if (hours >= 12 && hours < 18 ) out = 'День';
         if (hours >= 18 && hours < 24 ) out = 'Вечер';
         console.log(hours)
         element.querySelector('.card-item__value').textContent = out;
      }

      setInfo(dataMain);
   });
}  
general(baseUrl + byCity + currentLocation + metric + apiKey);

function settingsMenu() {
   const menu = document.getElementById('settings-menu');
   menu.classList.toggle('show');
   this.classList.toggle('header-settings--pressed');
}
settingsButton.addEventListener('click', settingsMenu);

function searchByCity() {
   const inputCity = document.getElementById('search--city');
   currentLocation = inputCity.value;
   general(baseUrl + byCity + currentLocation + metric + apiKey);
}
document.querySelector('.search-btn').addEventListener('click',searchByCity)
document.getElementById('search--city').addEventListener('keypress',(event) => {
   if (event.charCode == 13) searchByCity();
});




