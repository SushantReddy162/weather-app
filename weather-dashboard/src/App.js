import React, { useState, useEffect } from 'react';
import './WeatherDashboard.css';

function WeatherDashboard() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const API_KEY = 'af8da42b3cc7c1f436d841afead0fe94';
  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const fetchWeatherByLocation = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('Location not found');
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCity(search);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError('Geolocation not supported or permission denied');
        }
      );
    } else {
      setError('Geolocation not supported by this browser');
    }
  };

  const getWeatherIcon = (temp) => {
    if (temp > 30) return '☀️'; // Sunny
    if (temp > 20) return '🌤️'; // Partly Cloudy
    if (temp > 10) return '☁️'; // Cloudy
    return '❄️'; // Cold
  };

  return (
    <div className="weather-dashboard">
      <h1>Weather Dashboard</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
      </form>
      <button onClick={getLocation}>Get Weather for My Location</button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : weather ? (
        <div className="weather-info">
          <h2>Weather in {weather.name}</h2>
          <p>Temperature: {weather.main.temp} °C {getWeatherIcon(weather.main.temp)}</p>
          <p>Condition: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>No weather data available</p>
      )}
    </div>
  );
}

export default WeatherDashboard;
