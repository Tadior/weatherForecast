const getResponse = url => 
fetch(url).then(response => response.json());

function searchByCity() {
   const inputCity = document.getElementById('search--city');
   currentLocation = inputCity.value;
   getResponse(`${geoUrl}${byCity}${currentLocation}${apiKey}`).then((data) => {
      latitude = data[0].lat;
      longitude = data[0].lon;
      currentLocation = data[0].name;
      extraButtons.forEach((button) => {
         if (button.classList.contains('settings--active')) {
            let buttonData = button.getAttribute('data-request');
            switch (buttonData) {
               case 'day':
                  setStartData(baseUrl + byCity + currentLocation + '&units=' + metric + apiKey);
                  break;
               case 'week':
                  setWeekWeather(latitude,longitude);
                  break;
            }
         }
      });
   }).catch(error => {
      alert('Название города введено некорректно');
   });
}

function switchUnit(elem) {
   const unit = elem.getAttribute('data-unit');
   elem.parentNode.querySelector('.settings--active').classList.remove('settings--active');
   elem.classList.add('settings--active');
   let unitText = '';
   const settingsActiveType = extraMenu.querySelector('.settings--active').getAttribute('data-request');
   switch(unit) {
      case 'C':
         metric = 'metric';
         if (settingsActiveType === 'day') {
            setStartData(baseUrl + byCity + currentLocation + '&units=' + metric + apiKey);
         } else {
            setWeekWeather(latitude,longitude,currentLocation);
         }
         unitText = '°C';
         break;
      case 'F':
         metric = 'imperial';
         if (settingsActiveType === 'day') {
            setStartData(baseUrl + byCity + currentLocation + '&units=' + metric + apiKey);
         } else {
            setWeekWeather(latitude,longitude,currentLocation);
         }
         unitText = '°F';
         break;
   }
   settingsButton.querySelector('#unit').textContent = unitText;
}

function switchCards(type) {
   switch (type) {
      case 'day':
         week.innerHTML = '';
         setStartData(baseUrl + byCity + currentLocation + '&units=' + metric + apiKey);
         break;
      case 'week':
         mainWrapper.innerHTML = '';
         setWeekWeather(latitude,longitude,currentLocation);
         break;
   }
}

function getWeatherData() {

   function getUserPosition() {
      return new Promise((resolve,reject) => {
         navigator.geolocation.getCurrentPosition(resolve,reject);
      });
   }

   getUserPosition().then((data) => {
      latitude = data.coords.latitude;
      longitude = data.coords.longitude;
      setStartData(`${callUrl}lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=${metric}${apiKey}`);
   })
   .catch((error) => {
      setStartData(baseUrl + byCity + currentLocation + '&units=' + metric + apiKey);
   });
}

function setStartData(requestUrl) {
   getResponse(requestUrl).then((response) => {
      if (response.hasOwnProperty('message')) {
         alert('Ошибка: Введите корректное название города !');
      }
      let info = {};
      if ('lat' in response) {
         currentLocation = response.timezone.substr(response.timezone.lastIndexOf('/') + 1);
         info.cityName = response.timezone.substr(response.timezone.lastIndexOf('/') + 1);
         info.temperature = response.current.temp;
         info.feelsLike = response.current.feels_like;
         info.humidity = response.current.humidity;
         info.pressure = response.current.pressure;
         info.picture = response.current.weather[0].icon;
      } else if ('main' in response) {
         info.cityName = response.name;
         info.temperature = response.main.temp;
         info.feelsLike = response.main.feels_like;
         info.humidity = response.main.humidity;
         info.pressure = response.main.pressure;
         info.picture = response.weather[0].icon;
      }
      mainWrapper.innerHTML = `
      <div class="weather__card card">
         <div class="card__title">
            Погода:
            <span id="card-city" class="card-city">${info.cityName}</span>
         </div>
         <div class="card__main">
            <div class="card__temperature">
               <span id="card-temperature">${info.feelsLike}</span>
            </div>
            <div class="card__picture">
               <img src="http://openweathermap.org/img/wn/${info.picture}.png" alt="" class="weather-picture" id='weather-picture'>
            </div>
         </div>

         <div class="card-table">
            <div class="card-table__item card-item" data-type="temp">
               <div class="card-item__label">Температура</div>
               <div class="card-item__value">${info.temperature}</div>
            </div>
            <div class="card-table__item card-item" data-type="feels_like">
               <div class="card-item__label">Ощющается как</div>
               <div class="card-item__value">${info.feelsLike}</div>
            </div>
            <div class="card-table__item card-item" data-type="humidity">
               <div class="card-item__label">Влажность</div>
               <div class="card-item__value">${info.humidity}</div>
            </div>
            <div class="card-table__item card-item" data-type="pressure">
               <div class="card-item__label">Давление</div>
               <div class="card-item__value">${info.pressure}</div>
            </div>
         </div>
      </div>
      `;
   });
}

function createDailyCards(data) {
   let counter = 0;

   function sortDays() {
      const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const currentDayOfWeek = new Date().getDay();
      const sort = () => [...daysOfWeek.slice(currentDayOfWeek + 1),...daysOfWeek.slice(0,currentDayOfWeek + 1),...daysOfWeek.slice(currentDayOfWeek + 1)];
      return sort();
   }

   week.innerHTML = '<div class="week__wrapper"></div>';
   const cardWrapper = week.querySelector('.week__wrapper');
   const currentCity = document.createElement('div');
   currentCity.classList.add('week--city');
   currentCity.textContent = `Погода в ${currentLocation}`;
   week.prepend(currentCity);
   const weekDays = sortDays();
   function createCard() {
      const dataCounter = data.daily[counter];
      const card = document.createElement('div');
      card.classList.add('week-item');
      card.innerHTML = `
         <div class="week-item__main">
            <div class="week-item__day">
            ${weekDays[counter]}
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
      if (counter !== data.daily.length - 1) {
         counter++;
         createCard();
      } else {
         return false;
      }
   }
   createCard(data);
}

function setWeekWeather(latitude,longitude,city) {
   if (latitude.length != 0) {
      getResponse(`${callUrl}lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=${metric}${apiKey}`).then((response) => {
         createDailyCards(response);
      });
   } else {
      
   }
}

function toggleSettingsMenu(event) {
   menu.classList.toggle('show');
   settingsButton.classList.toggle('header-settings--pressed'); 
}