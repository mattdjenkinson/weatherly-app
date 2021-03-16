// Viewport

let vh = window.innerHeight * 0.01;

document.documentElement.style.setProperty("--vh", `${vh}px`);

// APP

const currentWeatherContainer = document.querySelector(".current--weather");
const currentDetailsContainer = document.querySelector(".details--weather");
const nextWeatherContainer = document.querySelectorAll(".next--weather");
const nextHours = document.querySelector("#next-hours");
const nextDays = document.querySelector("#next-days");

const startupCover = document.querySelector(".start-up");
const title = document.querySelectorAll(".title");

const getJSON = async function (url) {
  try {
    const fetchWeth = fetch(url);
    const res = await fetchWeth;
    const data = await res.json();
    // console.log(data);

    if (!res.ok) throw new Error(`(${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

const app = async function (pos) {
  const { latitude, longitude } = pos.coords;

  const weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=59dc2225b21e1a9f0d13b3bb1197da83`;
  const data = await getJSON(weatherApi);

  let currentWeather = {
    temp: data.current.temp,
    description: data.current.weather[0].main,
    icon: data.current.weather[0].icon,
    feelsLike: data.current.feels_like,
    humidity: data.current.humidity,
    uvi: data.current.uvi,
    wind: Math.round(data.current.wind_speed * 2.237),
    sunrise: new Date(data.current.sunrise * 1000)
      .toLocaleTimeString()
      .replace(/(\d{1,2}:\d{2}):\d{2}/, "$1"),
    sunset: new Date(data.current.sunset * 1000)
      .toLocaleTimeString()
      .replace(/(\d{1,2}:\d{2}):\d{2}/, "$1"),
    hourly: data.hourly.slice(1, 26),
    daily: data.daily.slice(1, 8),
  };

  const locationNameApi = `https://geocode.xyz/${latitude},${longitude}?geoit=json`;
  const userLocation = await getJSON(locationNameApi);
  // console.log(newLocation);

  let cityName = {
    city: userLocation.region,
  };

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const date = new Date();
  const currDay = date.toLocaleDateString("en-GB", dateOptions);

  const renderCurrentWeather = function () {
    currentWeatherContainer.innerHTML = `

      <div class="current--date">
      <p>${currDay}<br />${cityName.city}</p>
    </div>
    <div class="current--temp">
      <div class="current-temp--description"><p>${
        currentWeather.description
      }</p></div>
      <img src="/src/icons/${
        currentWeather.icon
      }.svg" alt="" class="current-temp--icon" />
      <div class="current-temp--text"><p>${Math.round(
        currentWeather.temp
      )}°</p></div>
    </div>

        `;
  };

  const renderNextHours = function () {
    currentWeather.hourly.forEach(function (hour) {
      nextHours.insertAdjacentHTML(
        "beforeend",
        `
      <li>
      <p class="text-hour">${new Date(hour.dt * 1000)
        .toLocaleTimeString()
        .replace(/(\d{1,2}:\d{2}):\d{2}/, "$1")}</p>
      <img src="/src/icons/${
        hour.weather[0].icon
      }.svg" width="40px" class="24-icon" />
      <p class="24-temp">${Math.round(hour.temp)}°</p>
    </li>`
      );
    });
  };

  const renderNextDays = function () {
    currentWeather.daily.forEach(function (day) {
      nextDays.insertAdjacentHTML(
        "beforeend",
        `
        <li>
        <p class="text-hour">${new Date(
          day.dt * 1000
        ).toLocaleDateString("en-GB", { weekday: "short" })}</p>
        <img src="/src/icons/${
          day.weather[0].icon
        }.svg" width="40px" class="24-icon" />
        <p class="24-temp">${Math.round(day.temp.max)}°</p>
      </li>
     `
      );
    });
  };

  const renderDetailsWeather = function () {
    currentDetailsContainer.innerHTML = `
    <ul>
          <li>
            <p class="details-title">Feels Like</p>
            <p class="details-description">${Math.round(
              currentWeather.feelsLike
            )}°</p>
          </li>
          <li>
            <p class="details-title">Humidity</p>
            <p class="details-description">${currentWeather.humidity}%</p>
          </li>
          <li>
            <p class="details-title">UVI</p>
            <p class="details-description">${currentWeather.uvi}</p>
          </li>
          <li>
            <p class="details-title">Wind</p>
            <p class="details-description">${Math.round(
              currentWeather.wind
            )} MPH</p>
          </li>
          <li>
            <p class="details-title">Sunrise</p>
            <p class="details-description">${currentWeather.sunrise}</p>
          </li>
          <li>
            <p class="details-title">Sunset</p>
            <p class="details-description">${currentWeather.sunset}</p>
          </li>
        </ul>



        `;
  };

  renderCurrentWeather();
  renderNextHours();
  renderDetailsWeather();
  renderNextDays();

  startupCover.style.display = "none";
  title.forEach((tit) => {
    tit.style.opacity = "1";
  });
  currentWeatherContainer.style.opacity = "1";
  nextWeatherContainer.forEach((cont) => {
    cont.style.opacity = "1";
  });
  currentDetailsContainer.style.opacity = "1";
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(app);
} else {
  alert("Could not get location");
}
