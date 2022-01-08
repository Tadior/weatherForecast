'use strict';
// All variables
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?';
const callUrl = 'https://api.openweathermap.org/data/2.5/onecall?';
//const urlCurrent = 'current';
//const urlHistorical = 'historical';
//const urlForecast = 'forecast';
const apiKey = '&appid=69cbf08ca122c19f4ce91ce83efb3893';
const mainWrapper = document.querySelector('.weather')
const byCity = 'q=';
const byWeek = '&exclude=daily';
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
//--------------------------------------------------------------
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
//general(baseUrl + byCity + currentLocation + metric + apiKey);

function toggleSettingsMenu(event) {
   menu.classList.toggle('show');
   settingsButton.classList.toggle('header-settings--pressed'); 
}
settingsButton.addEventListener('click', toggleSettingsMenu);


// Search by city
function searchByCity() {
   const inputCity = document.getElementById('search--city');
   currentLocation = inputCity.value;
   general(baseUrl + byCity + currentLocation + metric + apiKey);
}

document.querySelector('.search-btn').addEventListener('click',searchByCity);
document.getElementById('search--city').addEventListener('keypress',(event) => {
   if (event.charCode == 13) searchByCity();
});

//----------------------------------------

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
//--------------------------------------------------------------

//Functional for extra buttons
const extraButtons = document.querySelectorAll('#extra-btn');
const extraMenu = document.getElementById('extra-menu');

extraMenu.addEventListener('click', (event) => {
   if(event.target.id != 'extra-btn') {
      return false;
   }

   extraButtons.forEach(element => {
      if (!element.classList.contains('settings--active')) {
         extraMenu.querySelector('.settings--active').classList.remove('settings--active')
         element.classList.add('settings--active');
      }
   });
   const requestType = event.target.getAttribute('data-request');
   switchCards(requestType);
});
//-------------------------------------------------------------------------
function switchCards(type) {
   switch (type) {
      case 'day':
         general(baseUrl + byCity + currentLocation + metric + apiKey);
         console.log('day');
         break;
      case 'week':
         //const r = getResponse('https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,minutely&appid=69cbf08ca122c19f4ce91ce83efb3893');
         //r.then((data) => {
         //   console.log(data)
         //})
         mainWrapper.innerHTML = '';
         getWeatherData();

         break;
   }
}

function getWeatherData() {
   function setCurentWeather() {
      
   }
   navigator.geolocation.getCurrentPosition((success) => {
      const {latitude, longitude} = success.coords;
      getResponse(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely${metric}${apiKey}`).then((response) => {
         const dailyData = response.daily;
         console.log(response)
         function createDailyCards(data) {
            let counter = 1;
            function sortDays() {
               const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thirsday','Friday','Saturday'];
               const currentDayOfWeek = new Date().getDay();
               const sort = () => [...daysOfWeek.slice(currentDayOfWeek),...daysOfWeek.slice(0,currentDayOfWeek)];
               return sort();
            }
            const cardWrapper = document.querySelector('.week__wrapper');

            const weekDays = sortDays();

            function createCard() {
               const dataCounter = data[counter];
               const card = document.createElement('div');
               card.classList.add('week-item');

               card.innerHTML = `
                  <div class="week-item__main">
                     <div class="week-item__day">
                     ${weekDays[counter - 1]}
                     </div>
                     <div class="week-item__picture">
                        <img src="http://openweathermap.org/img/wn/${dataCounter.weather[0].icon}.png" alt="weather">
                     </div>
                     <div class="week-item__main-temperature">
                        Ощющается как <span>${dataCounter.feels_like.day}</span>
                     </div>
                  </div>
                  <div class="week-item__info">
                     <div class="week-item__fluid">
                        <div class="week-item__info-item week-item__day-temperature">
                           Температура днем: <span class="week-item__info-item--value">${dataCounter.temp.day}</span>
                        </div>
                        <div class="week-item__info-item week-item__night-temperature">
                           Температура ночью:<span class="week-item__info-item--value">${dataCounter.temp.night}</span>
                        </div>
                        <div class="week-item__info-item">
                           Влажность:<span class="week-item__info-item--value">${dataCounter.humidity}</span>
                        </div>
                        <div class="week-item__info-item">
                           Давление:<span class="week-item__info-item--value">${dataCounter.pressure}</span>
                        </div>
                        <div class="week-item__info-item">
                           Скорость ветра:<span class="week-item__info-item--value">${dataCounter.wind_speed}</span>
                        </div>
                     </div>
                  </div>
               `;

               cardWrapper.append(card);

               if (counter !== data.length - 1) {
                  counter++;
                  createCard();
               } else {
                  return false;
               }
            }
            createCard(data);
         }
         createDailyCards(dailyData);
      });
   }, error => {
      if (error) {
         //alert(error.message);
         //general(baseUrl + byCity + currentLocation + metric + apiKey);
      }
   });
}
general(baseUrl + byCity + currentLocation + metric + apiKey);
//getWeatherData();
//console.log(getWeatherData())




