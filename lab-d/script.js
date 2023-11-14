function getWeather() {
    const address = document.getElementById("addressInput").value;

    if (!address) {
        alert("Please enter an address");
        return;
    }

    const apiKey = "7ded80d91f2b280ec979100cc8bbba94";
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${address}&appid=${apiKey}`;

    // Usuwamy infoText
    const infoText = document.getElementById("infoText");
    if (infoText) {
        infoText.remove();
    }

    // Fetch current weather
    const currentWeatherRequest = new XMLHttpRequest();
    currentWeatherRequest.open("GET", currentWeatherUrl, true);
    currentWeatherRequest.onreadystatechange = function () {
        if (currentWeatherRequest.readyState == 4 && currentWeatherRequest.status == 200) {
            const currentWeatherData = JSON.parse(currentWeatherRequest.responseText);

            console.log("Current Weather Response:", currentWeatherData);

            // Fetch forecast inside the callback of current weather
            fetch(forecastUrl)
                .then(response => response.json())
                .then(data => {
                    console.log("Forecast Response:", data);

                    if (data.list) {
                        const forecastData = data.list.filter(item => item.dt_txt.includes("15:00:00"));
                        displayCurrentWeather(currentWeatherData);
                        displayForecast(forecastData);
                    } else {
                        console.error('Error fetching forecast:', data.message);
                    }
                })
                .catch(error => console.error('Error fetching forecast:', error));
        }
    };
    currentWeatherRequest.send();
}

function displayCurrentWeather(data) {
    const currentWeatherContainer = document.getElementById("currentWeather");

    // Clear previous content
    currentWeatherContainer.innerHTML = "";

    // Create elements for displaying weather information
    const temperature = document.createElement("p");
    temperature.textContent = `Temperature: ${Math.round(data.main.temp - 273.15)}°C`;

    const feelsLike = document.createElement("p");
    feelsLike.textContent = `Feels Like: ${Math.round(data.main.feels_like - 273.15)}°C`;

    const weatherDescription = document.createElement("p");
    weatherDescription.textContent = `Weather: ${data.weather[0].description}`;

    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
    const weatherIcon = document.createElement("img");
    weatherIcon.src = iconUrl;
    weatherIcon.alt = "Weather Icon";

    const dayOfWeek = document.createElement("p");
    const currentDate = new Date();
    const options = { weekday: 'long' }; // 'long' oznacza pełną nazwę dnia
    dayOfWeek.textContent = `Day: ${currentDate.toLocaleDateString('en-US', options)}`;

    // Append elements to the container
    currentWeatherContainer.appendChild(weatherIcon);
    currentWeatherContainer.appendChild(weatherDescription);
    currentWeatherContainer.appendChild(temperature);
    currentWeatherContainer.appendChild(feelsLike);
    currentWeatherContainer.appendChild(dayOfWeek);
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecast");

    // Clear previous content
    forecastContainer.innerHTML = "";

    // Display forecast title
    const forecastTitle = document.createElement("p");
    forecastTitle.textContent = "5 Day Forecast";
    forecastContainer.appendChild(forecastTitle);

    // Options for date formatting
    const options = { weekday: 'long' };

    // Loop through forecast data
    data.forEach(item => {
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecastItem");

        // Check if necessary data is available
        if (item.weather && item.weather[0]) {
            const temperature = document.createElement("p");
            temperature.textContent = `Temperature: ${Math.round(item.main.temp - 273.15)}°C`;

            const weatherDescription = document.createElement("p");
            weatherDescription.textContent = `Weather: ${item.weather[0].description}`;

            const iconCode = item.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
            const weatherIcon = document.createElement("img");
            weatherIcon.src = iconUrl;
            weatherIcon.alt = "Weather Icon";

            const dayOfWeek = document.createElement("p");
            const forecastDate = new Date(item.dt * 1000);

            // Add one day to the forecast date
            forecastDate.setDate(forecastDate.getDate() + 1);

            dayOfWeek.textContent = `Day: ${forecastDate.toLocaleDateString('en-US', options)}`;

            // Append elements to the forecast item
            forecastItem.appendChild(weatherIcon);
            forecastItem.appendChild(weatherDescription);
            forecastItem.appendChild(temperature);
            forecastItem.appendChild(dayOfWeek);

            // Append the forecast item to the forecast container
            forecastContainer.appendChild(forecastItem);
        }
    });
}









