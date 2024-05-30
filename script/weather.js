import { fetchWeatherData } from './api.js';
const elements = {
  cityInput: document.getElementById('city-input'),
  weatherImg: document.getElementById('weather-img'),
  temperature: document.getElementById('temperature'),
  weatherDscr: document.getElementById('weather-dscr'),
  locationElement: document.getElementById('location'),
  dateElement: document.getElementById('date'),
  timeElement: document.getElementById('time'),
  windSpeedElement: document.getElementById('wind-speed'),
  windDegElement: document.getElementById('wind-deg'),
  humidityElement: document.getElementById('humidity'),
  feelElement: document.getElementById('feel'),
  pressureElement: document.getElementById('pressure'),
  temMinElement: document.getElementById('temp-min'),
  temMaxElement: document.getElementById('temp-max'),
  visibilityElement: document.getElementById('visibility'),
  sunriseElement: document.getElementById('sunrise'),
  sunsetElement: document.getElementById('sunset'),
};
const search = document.getElementById('search-btn');
let cityName = localStorage.getItem('cityName') || 'purwokerto';


async function getWeatherData(cityName) {
    try {
        const { weatherData } = await fetchWeatherData(cityName);
        document.getElementById('empty').style.display = "none"
        displayWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      document.getElementById('empty').style.display = "block"
    }
}



const displayWeather = (weatherData) => {
  const iconCode = weatherData.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  const temp = Math.round(weatherData.main.temp);
  const description = weatherData.weather[0].description;

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = monthName[today.getMonth()];
  let dd = today.getDate();
  let day = today.getDay();

  if (dd < 10) dd = '0' + dd;

  const currentDate = dd + '-' + mm + '-' + yyyy;
  const currentTime = dayName[day] + ', ' + today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const directions = [
    'Utara',
    'Utara Timur Laut',
    'Timur Laut',
    'Timur Laut',
    'Timur',
    'Tenggara',
    'Tenggara',
    'Selatan Tenggara',
    'Selatan',
    'Selatan Barat Daya',
    'Barat Daya',
    'Barat Daya',
    'Barat',
    'Barat Laut',
    'Barat Laut',
    'Utara Barat Laut',
  ];
  const windVal = Math.floor(weatherData.wind.deg / 22.5 + 0.5);
  const windDeg = directions[windVal % 16];
  const windSpeed = weatherData.wind.speed + ' km/h';
  const humidity = weatherData.main.humidity + '%';
  const feel = Math.round(weatherData.main.feels_like) + '°C';
  const pressure = weatherData.main.pressure + ' hPa';
  const temMin = Math.round(weatherData.main.temp_min) + '°C';
  const temMax = Math.round(weatherData.main.temp_max) + '°C';
  const visibility = weatherData.visibility + '   M';
  const sunriseCode = weatherData.sys.sunrise;
  const sunsetCode = weatherData.sys.sunset;
  const sunrise = new Date(sunriseCode * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date(sunsetCode * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  elements.weatherImg.src = iconUrl;
  elements.temperature.innerText += `${temp}°C`;
  elements.weatherDscr.innerText += capitalizeFirstLetter(description);
  elements.locationElement.innerText += capitalizeFirstLetter(weatherData.name);
  elements.dateElement.innerText += currentTime;
  elements.timeElement.innerText += currentDate;
  elements.windSpeedElement.innerText += windSpeed;
  elements.windDegElement.innerText += windDeg;
  elements.humidityElement.innerText += humidity;
  elements.feelElement.innerText += feel;
  elements.pressureElement.innerText += pressure;
  elements.temMinElement.innerText += temMin;
  elements.temMaxElement.innerText += temMax;
  elements.visibilityElement.innerText += visibility;
  elements.sunriseElement.innerText += sunrise;
  elements.sunsetElement.innerText += sunset;
};

search.addEventListener('click', (e) => {
  e.preventDefault();
  const newCityName = elements.cityInput.value;
  localStorage.setItem('cityName', newCityName);
  cityName = newCityName;
  resetUI();
  getWeatherData(cityName);
});

const resetUI = () => {
  for (const key in elements) {
    if (Object.hasOwnProperty.call(elements, key)) {
      elements[key].innerText = '';
    }
  }
};

getWeatherData(cityName);
