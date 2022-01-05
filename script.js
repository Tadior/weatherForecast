'use strict';

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';
//const urlCurrent = 'current';
//const urlHistorical = 'historical';
//const urlForecast = 'forecast';
const apiKey = '';
const byCity = '?q=';
let currentLocation = 'Moscow';
const metric = '&units=metric';
const imperial = '&units=imperial';

const cardItems = Array.from(document.querySelectorAll('.card-item'));
const settingsButton = document.getElementById('header-settings');
const cardTemperature = document.querySelector('#card-temperature');

const cardTypes = cardItems.map(function(item) {
   return item.getAttribute('data-type');
});

const menu = document.getElementById('settings-menu');

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
      //const timezone = data.timezone;

      const weatherPicture = document.querySelector('.weather-picture');

      function setInfo(info) {

         for (let item in info) {
            for (let i of cardItems) {
               if (i.getAttribute('data-type') === item) {
                  i.querySelector('.card-item__value').textContent = info[item];
               }
            }
         }

         setExtraInfo(cardTemperature, dataMain.temp);
         setExtraInfo(document.querySelector('#card-city'), data.name);
         setExtraInfo(document.getElementById('card-status'), getCurrentTime(data));
         setWheatherPicture(dataWeather);
         //setDay(getCurrentTime(data));
      }

      function setExtraInfo(item, value) {
         item.textContent = value;
      }

      function setWheatherPicture(info) {
         weatherPicture.src = `http://openweathermap.org/img/wn/${info.icon}.png`;
      }

      function setUnit(url) {
         if (url.includes('metric')) {
            cardTemperature.textContent += '°C';
         } else {
            cardTemperature.textContent += '°F';
         }
      }

      function getCurrentTime(data) {
         
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
      setUnit(requestUrl);
   });
}  
general(baseUrl + byCity + currentLocation + metric + apiKey);

function toggleSettingsMenu(event) {
   menu.classList.toggle('show');
   settingsButton.classList.toggle('header-settings--pressed'); 
}
settingsButton.addEventListener('click', toggleSettingsMenu);



function searchByCity() {
   const inputCity = document.getElementById('search--city');
   currentLocation = inputCity.value;
   general(baseUrl + byCity + currentLocation + metric + apiKey);
}
document.querySelector('.search-btn').addEventListener('click',searchByCity);
document.getElementById('search--city').addEventListener('keypress',(event) => {
   if (event.charCode == 13) searchByCity();
});



function switchUnit(elem) {
   const unit = elem.getAttribute('data-unit');
   elem.parentNode.querySelector('.settings--active').classList.remove('settings--active');
   elem.classList.add('settings--active');
   let unitText = '';
   switch(unit) {
      case 'C':
         general(baseUrl + byCity + currentLocation + metric + apiKey);
         unitText = '°C';
         break;
      case 'F': 
         general(baseUrl + byCity + currentLocation + imperial + apiKey);
         unitText = '°F';
         break;
   }
   settingsButton.querySelector('#unit').textContent = unitText;
}


menu.addEventListener('click', (event) => {
   if (event.target.getAttribute('data-unit')) {
      switchUnit(event.target);
      toggleSettingsMenu();
   }
   return false;
});

const extraButtons = document.querySelectorAll('#extra-btn');
const extraMenu = document.getElementById('extra-menu');
extraMenu.addEventListener('click', (event) => {
   if(event.target.id != 'extra-btn') {
      return false;
   }

   extraButtons.forEach(element => {
      if (element.classList.contains('settings--active')) {
         element.classList.remove('settings--active');
      } else {
         element.classList.add('settings--active');
      }
   });
   switchCards();
});

function switchCards() {
   console.log('dffs')
}



