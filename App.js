import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_Key = "265c8fc5f3020c81673a5ad780db4218";

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Enter a city");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resCurrent = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`
      );
      const dataCurrent = await resCurrent.json();

      if (dataCurrent.cod !== 200) {
        throw new Error(dataCurrent.message);
      }

      const resForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_Key}&units=metric`
      );
      const dataForecast = await resForecast.json();

      const dailyMap = {};
      dataForecast.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyMap[date]) dailyMap[date] = item;
      });

      setCurrentWeather(dataCurrent);
      setForecast(Object.values(dailyMap).slice(0, 5));
    } catch (err) {
      setError(err.message);
      setCurrentWeather(null);
      setForecast([]);
    }

    setLoading(false);
  };

  const formatDay = (unix) =>
    new Date(unix * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    });

  return (
    <div className="app">
      {/* HEADER */}
      <div className="top">
        <h1 className="title">🌤 Weather</h1>

        <div className="search">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button onClick={fetchWeather}>Search</button>
        </div>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* CURRENT */}
      {currentWeather && (
        <div className="current">
          <h2>
            {currentWeather.name}, {currentWeather.sys.country}
          </h2>

          {/* <img
            src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
            alt=""
          /> */}

          <h1 className="temp">
            {Math.round(currentWeather.main.temp)}°
          </h1>

          <p className="desc">
            {currentWeather.weather[0].description}
          </p>

          <div className="details">
            <span>💧 {currentWeather.main.humidity}%</span>
            <span>💨 {currentWeather.wind.speed} m/s</span>
          </div>
        </div>
      )}

      {/* FORECAST */}
      {forecast.length > 0 && (
        <div className="forecast">
          {forecast.map((day, i) => (
            <div key={i} className="forecast-card">
              <p className="day">{formatDay(day.dt)}</p>

              {/* <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt=""
              /> */}

              {/* <p className="temp-small">
                {Math.round(day.main.temp)}°
              </p> */}
              <p>
                🌡️{day.main.temp}°C
              </p>


              <p className="desc-small">
                {day.weather[0].description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;