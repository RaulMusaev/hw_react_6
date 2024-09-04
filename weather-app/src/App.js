import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = 'ed4f7567ea0f3110220a186fd95b29ec';

const App = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [weather, setWeather] = useState(null);
  const [settings, setSettings] = useState({
    textColor: '#000000',
    backgroundColor: '#ffffff',
    favoriteCity: '',
  });
  const [theme, setTheme] = useState('light');
  
  const handleCityChange = (e) => setCity(e.target.value);
  const handleCountryChange = (e) => setCountry(e.target.value);

  const fetchWeather = async () => {
    if (!city || !country) return;
    
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`);
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  const handleFetchWeather = () => {
    fetchWeather();
  };

  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  };

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings) {
      setSettings(savedSettings);
    }
    const hour = new Date().getHours();
    setTheme(hour >= 6 && hour < 18 ? 'light' : 'dark');
  }, []);

  return (
    <div className={`App ${theme}`} style={{ color: settings.textColor, backgroundColor: settings.backgroundColor }}>
      <section className="section">
        <h2>Weather App</h2>
        <input type="text" placeholder="City" value={city} onChange={handleCityChange} />
        <input type="text" placeholder="Country" value={country} onChange={handleCountryChange} />
        <button onClick={handleFetchWeather}>Get Weather</button>
        {weather && (
          <div className="weather">
            <h3>{weather.name}, {weather.sys.country}</h3>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Weather: {weather.weather[0].description}</p>
            <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
            {weather.sys.sunrise > Date.now() / 1000 && !weather.sys.sunset < Date.now() / 1000 && <img src="https://via.placeholder.com/50?text=Sun" alt="Sun" />}
            {weather.sys.sunset < Date.now() / 1000 && <img src="https://via.placeholder.com/50?text=Moon" alt="Moon" />}
          </div>
        )}
      </section>

      <section className="section">
        <h2>User Settings</h2>
        <input type="color" name="textColor" value={settings.textColor} onChange={handleSettingsChange} />
        <input type="color" name="backgroundColor" value={settings.backgroundColor} onChange={handleSettingsChange} />
        <input type="text" name="favoriteCity" placeholder="Favorite City" value={settings.favoriteCity} onChange={handleSettingsChange} />
        <button onClick={handleSaveSettings}>Save Settings</button>
      </section>

      <section className="section">
        <h2>Display Settings</h2>
        <p><strong>Favorite City:</strong> {settings.favoriteCity}</p>
      </section>
    </div>
  );
};

export default App;