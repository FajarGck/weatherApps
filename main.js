const search = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherImg = document.getElementById('weather-img');
const temperature = document.getElementById('temperature');
const weatherDscr = document.getElementById('weather-dscr');
const locationElement = document.getElementById('location');
const dateElement = document.getElementById('date');
const timeElement = document.getElementById('time');
const windSpeedElement = document.getElementById('wind-speed');
const windDegElement = document.getElementById('wind-deg');
const humidityElement = document.getElementById('humidity');
const feelElement = document.getElementById('feel');
const pressureElement = document.getElementById('pressure');
const temMinElement = document.getElementById('temp-min');
const temMaxElement = document.getElementById('temp-max');
const visibilityElement = document.getElementById('visibility');
const sunriseElement = document.getElementById('sunrise');
const sunsetElement = document.getElementById('sunset');
var cityName = 'Jakarta';

async function callApi(cityName) {
  const apiKey = `9d57ea210edcb7e5f92c2958d07deda2`;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  const foreCastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  try {
    const weatherResponse = await fetch(weatherUrl);
    const forecastResponse = await fetch(foreCastUrl);
    if (!weatherResponse.ok && !forecastResponse.ok) {
      throw new Error(`Erorr Status: ${response.status}`);
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    console.table(weatherData.sys);

    displayWeather(weatherData);
  } catch (error) {
    console.log(error);
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
  const humidity = weatherData.main.humidity + ' %';
  const feel = Math.round(weatherData.main.feels_like) + '°C';
  const pressure = weatherData.main.pressure + ' hPa';
  const temMin = Math.round(weatherData.main.temp_min) + '°C';
  const temMax = Math.round(weatherData.main.temp_max) + '°C';
  const visibility = weatherData.visibility + '   km';
  const sunriseCode = weatherData.sys.sunrise;
  const sunsetCode = weatherData.sys.sunset;
  const sunrise = new Date(sunriseCode * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date(sunsetCode * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  console.log(windDeg);

  document.getElementById('weather-img').src = iconUrl;
  document.getElementById('temperature').innerText += `${temp}°C`;
  document.getElementById('weather-dscr').innerText += capitalizeFirstLetter(description);
  document.getElementById('location').innerText += capitalizeFirstLetter(weatherData.name);
  document.getElementById('date').innerText += currentTime;
  document.getElementById('time').innerText += currentDate;
  document.getElementById('wind-speed').innerText += windSpeed;
  document.getElementById('wind-deg').innerText += windDeg;
  document.getElementById('humidity').innerText += humidity;
  document.getElementById('feel').innerText += feel;
  document.getElementById('pressure').innerText += pressure;
  document.getElementById('temp-min').innerText += temMin;
  document.getElementById('temp-max').innerText += temMax;
  document.getElementById('visibility').innerText += visibility;
  document.getElementById('sunrise').innerText += sunrise;
  document.getElementById('sunset').innerText += sunset;
};

search.addEventListener('click', (e) => {
  e.preventDefault();
  cityName = cityInput.value !== '' ? cityInput.value : 'Jakarta';
  resetUI();
  callApi(cityName);
});

const resetUI = () => {
  weatherImg.src = '';
  temperature.innerText = '';
  weatherDscr.innerText = '';
  locationElement.innerText = '';
  dateElement.innerText = '';
  timeElement.innerText = '';
  windSpeedElement.innerText = '';
  windDegElement.innerText = '';
  humidityElement.innerText = '';
  feelElement.innerText = '';
  pressureElement.innerText = '';
  temMinElement.innerText = '';
  temMaxElement.innerText = '';
  sunriseElement.innerText = '';
  sunsetElement.innerText = '';
};

callApi(cityName);
