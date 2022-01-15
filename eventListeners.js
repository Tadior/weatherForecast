settingsButton.addEventListener('click', toggleSettingsMenu);

document.querySelector('.search-btn').addEventListener('click',searchByCity);
document.getElementById('search--city').addEventListener('keypress',(event) => {
   if (event.charCode == 13) searchByCity();
});


menu.addEventListener('click', (event) => {
   if (event.target.getAttribute('data-unit')) {
      switchUnit(event.target);
      toggleSettingsMenu();
   }
   return false;
});

extraMenu.addEventListener('click', (event) => {
   if(event.target.id != 'extra-btn') {
      return false;
   }
   if (!event.target.classList.contains('settings--active')) {
      extraButtons.forEach((button) => {
         button.classList.remove('settings--active');
      });
      event.target.classList.add('settings--active');
   }

   const requestType = event.target.getAttribute('data-request');
   switchCards(requestType);
});
