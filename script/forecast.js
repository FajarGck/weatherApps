const elements = {
  cityInput: document.getElementById('city-input'),
  weatherImg: document.getElementById('weather-img'),
  temperature: document.getElementById('temperature'),
  weatherDscr: document.getElementById('weather-dscr'),
  locationElement: document.getElementById('location'),
  dateElement: document.getElementById('date'),
  timeElement: document.getElementById('time'),
  info: document.getElementById('info'),
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

async function callApi(cityName) {
  const apiKey = `9d57ea210edcb7e5f92c2958d07deda2`;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  const foreCastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([fetch(weatherUrl), fetch(foreCastUrl)]);
    if (!weatherResponse.ok && !forecastResponse.ok) {
      throw new Error(`Erorr fetching data!`);
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();
    displayWeather(weatherData);
    displayForecast(forecastData);
  } catch (error) {
    console.log(error);
    elements.weatherImg.src = './assets/error.png';
    elements.locationElement.innerText += 'City Not Found';
    alert('Try Input City Name Again');
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

const displayForecast = (forecastData) => {
  function processWeatherData(data) {
    const dailyWeather = {};

    // Loop melalui setiap data cuaca
    data.forEach((item) => {
      // Konversi UNIX timestamp menjadi tanggal
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const dayOfMonth = date.getDate();

      // Gabungkan nama hari dan tanggal
      const dateString = `${day}, ${month} ${dayOfMonth}`;

      // Ambil data suhu
      const temp = item.main.temp;

      // Ambil deskripsi cuaca
      const description = item.weather[0].description;

      // Ambil ikon cuaca
      const icon = item.weather[0].icon;

      // Jika data untuk hari ini belum ada, tambahkan ke objek dailyWeather
      if (!dailyWeather[dateString]) {
        dailyWeather[dateString] = {
          temps: [temp], // Gunakan array untuk menyimpan suhu per hari
          descriptions: [description],
          icons: [icon], // Simpan ikon cuaca per hari
        };
      } else {
        // Jika data untuk hari ini sudah ada, tambahkan suhu dan ikon ke dalam array
        dailyWeather[dateString].temps.push(temp);
        dailyWeather[dateString].descriptions.push(description);
        dailyWeather[dateString].icons.push(icon);
      }
    });

    // Hitung rata-rata suhu per hari
    const avgTemps = {};
    for (const day in dailyWeather) {
      const temps = dailyWeather[day].temps;
      const avgTemp = temps.reduce((acc, curr) => acc + curr, 0) / temps.length;
      avgTemps[day] = avgTemp.toFixed(2); // Round to 2 decimal places
    }

    return { dailyWeather, avgTemps };
  }

  // Panggil fungsi processWeatherData dengan data cuaca
  const { dailyWeather, avgTemps } = processWeatherData(forecastData.list);

  // Loop melalui hasil data dan masukkan ke dalam elemen HTML
  for (const day in avgTemps) {
    const forecastHTML = `
      <div class="list-card d-flex justify-content-around align-items-center mb-1 mx-2 shadow-sm gap-3">
        <h6 class="date-forecast">${day}</h6>
        <div class="d-flex align-items-center">
          <img src="http://openweathermap.org/img/wn/${dailyWeather[day].icons[0]}.png" width="50px" height="50px" alt="weather-icon">
          <h6 class="avg-deg-forecast mb-0">${Math.round(avgTemps[day])}°C</h6>
        </div>
        <h6 class="forecast-description mb-0">${dailyWeather[day].descriptions[0]}</h6>        
      </div>
    `;
    elements.info.innerHTML += forecastHTML;
  }
};

search.addEventListener('click', (e) => {
  e.preventDefault();
  const newCityName = elements.cityInput.value;
  localStorage.setItem('cityName', newCityName);
  cityName = newCityName;
  resetUI();
  callApi(cityName);
});

const resetUI = () => {
  for (const key in elements) {
    if (Object.hasOwnProperty.call(elements, key)) {
      elements[key].innerText = '';
    }
  }
};

callApi(cityName);
