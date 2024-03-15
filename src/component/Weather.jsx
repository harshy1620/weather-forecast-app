import React, { useState, useEffect } from "react";

import { WiHumidity } from "react-icons/wi";
import { MdLocationPin, MdSearch } from "react-icons/md";
import { FaWind, FaRegCompass, FaTemperatureHigh } from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Weather = () => {
  const [location, setLocation] = useState("Delhi");
  const [displayLocation, setDisplayLocation] = useState("Delhi");
  const [weatherData, setWeatherData] = useState(null);
  const [futureData, setFutureData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const apiKey = process.env.REACT_APP_API_KEY;
  const apiUrl = process.env.REACT_APP_BASE_URL;

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevIsCelsius) => !prevIsCelsius);
  };

  // getting the current weather on clicking the submit icon
  const getCurrentWeather = async () => {
    try {
      const unit = isCelsius ? "metric" : "imperial";
      const response = await fetch(
        `${apiUrl}2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.message === "city not found") {
        toast.error("City not found.");
      } else {
        setWeatherData(data);
        setDisplayLocation(data.name);
      }
    } catch (error) {
      setWeatherData(null);
      toast.error("Error in fetching weather data,or type the city name");
      console.log("Error in fetching data:", error);
    }
  };

  // by default getting the starting weather data
  useEffect(() => {
    const getWeatherData = async () => {
      const unit = isCelsius ? "metric" : "imperial";
      const response = await fetch(
        `${apiUrl}2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`
      );
      const data = await response.json();
      setWeatherData(data);
    };
    getWeatherData();
    // eslint-disable-next-line
  }, [isCelsius]);

  // getting future weather data
  useEffect(() => {
    const unit = isCelsius ? "metric" : "imperial";
    const getFutureData = async () => {
      const response = await fetch(
        `${apiUrl}2.5/forecast?q=${location}&units=${unit}&appid=${apiKey}`
      );
      const data = await response.json();
      setFutureData(data);
    };
    getFutureData();
    // eslint-disable-next-line
  }, [isCelsius, weatherData]);

  // Gets weather dataset of unique dates (5 days)
  const uniqueDates = [
    ...new Set(futureData?.list?.map((item) => item.dt_txt.split(" ")[0])),
  ];

  // Gets the weather data of 00:00:00 time
  const uniqueForecastData = uniqueDates?.map((date) => {
    const selectedTimeData = futureData?.list?.find((item) =>
      item.dt_txt.startsWith(`${date} 00:00:00`)
    );
    return selectedTimeData;
  });

  // getting icon image source
  const getIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  return (
    <div className="weather-wrapper">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ background: "transparent" }}
      />

      {/* LEFT SECTION START*/}
      <div className="right-section">
        {/* SEARCH BAR */}
        <div className="search-bar">
          <MdLocationPin color="white" />
          <input
            type="text"
            placeholder="Search for location"
            val={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <MdSearch color="white" onClick={getCurrentWeather} />
        </div>

        {/* MAIN DETAILS */}
        <div className="main-details">
          {/* DIV FOR DETAILS */}
          <div className="text-details">
            <h1>{displayLocation}</h1>

            <div>
              <h1 style={{ color: "red" }}>
                {weatherData?.main?.temp}
                {isCelsius ? "° C" : "° F"}
                <h4>{weatherData?.weather?.[0]?.description}</h4>
              </h1>
            </div>
          </div>
          {/* DIV FOR ICON */}
          <div className="icon-details">
            <img src={getIconUrl(weatherData?.weather?.[0].icon)} alt="icon" />
          </div>
        </div>

        {/* AIR CONDITIONS */}
        <div className="air-conditions">
          <h4> TODAY'S AIR CONDITIONS</h4>

          <div className="air-condition-details-wrapper">
            <div className="air-condition-details">
              <div className="air-condition-details-div">
                <WiHumidity />
                <div>
                  <h5>Humidity</h5>
                  <p>{weatherData?.main?.humidity}</p>
                </div>
              </div>

              <div className="air-condition-details-div">
                <FaTemperatureHigh />
                <div>
                  <h5>Min/Max Temperature</h5>
                  <p>
                    {weatherData?.main?.temp_min}/{weatherData?.main?.temp_max}
                  </p>
                </div>
              </div>
            </div>

            <div className="air-condition-details">
              <div className="air-condition-details-div">
                <FaWind />
                <div>
                  <h5>Wind Speed</h5>
                  <p>{weatherData?.wind?.speed}</p>
                </div>
              </div>

              <div className="air-condition-details-div">
                <FaRegCompass />
                <div>
                  <h5>Wind Direction</h5>
                  <p>{weatherData?.wind?.deg}&deg;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* LEFT SECTION END*/}

      {/* FARHENHEIGHT AND CELSIUS TOGGLE START */}
      <div className="toggle-container">
        <span
          className={`unit ${isCelsius ? "active" : ""}`}
          onClick={toggleTemperatureUnit}
        >
          °C
        </span>
        <span className="divider"> | </span>
        <span
          className={`unit ${!isCelsius ? "active" : ""}`}
          onClick={toggleTemperatureUnit}
        >
          °F
        </span>
      </div>
      {/* FARHENHEIGHT AND CELSIUS TOGGLE END */}

      {/* RIGHT SECTION START*/}
      <div className="left-section">
        {/* HEADING */}
        <h4>5-DAY FORECAST</h4>
        {/* FORECAST LIST */}
        <ul className="forecast-list">
          {uniqueForecastData?.slice(1).map((day, index) => (
            <li key={index}>
              <h5>
                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </h5>
              <img src={getIconUrl(day.weather[0].icon)} alt="icon" />
              <p>{day.weather[0].description}</p>
              <p>
                {day.main.temp}
                {isCelsius ? "° C" : "° F"}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {/* RIGHT SECTION END*/}
    </div>
  );
};

export default Weather;
