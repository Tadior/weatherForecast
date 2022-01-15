'use strict';
// All variables
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?';
const callUrl = 'https://api.openweathermap.org/data/2.5/onecall?';
const geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?';
const apiKey = '&appid=69cbf08ca122c19f4ce91ce83efb3893';
const mainWrapper = document.querySelector('.weather');
const week = document.querySelector('.week');
const byCity = 'q=';
const byWeek = '&exclude=daily';
let currentLocation = 'Moscow';
let metric = 'metric';
let longitude = '';
let latitude = '';

const cardItems = Array.from(document.querySelectorAll('.card-item'));
const settingsButton = document.getElementById('header-settings');
const cardTemperature = document.querySelector('#card-temperature');

const cardTypes = cardItems.map(item => item.getAttribute('data-type'));

const menu = document.getElementById('settings-menu');
const extraButtons = document.querySelectorAll('#extra-btn');
const extraMenu = document.getElementById('extra-menu');