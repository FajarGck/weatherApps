const apiKey = '9d57ea210edcb7e5f92c2958d07deda2';

async function fetchWeatherData(cityName) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
    ]);

    if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch data');
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    return { weatherData, forecastData };
}

export { fetchWeatherData };