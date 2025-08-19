const express = require('express');
const axios = require('axios');

const router = express.Router();

// Philippine cities and provinces data
const philippineCities = {
  'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig', 'Mandaluyong', 'Marikina', 'Pasay', 'Caloocan', 'Las Piñas', 'Muntinlupa', 'Parañaque', 'Valenzuela', 'Malabon', 'Navotas', 'San Juan', 'Pateros'],
  'Cebu': ['Cebu City', 'Lapu-Lapu', 'Mandaue', 'Talisay', 'Toledo', 'Danao', 'Carcar'],
  'Davao': ['Davao City', 'Tagum', 'Panabo', 'Samal', 'Digos'],
  'Iloilo': ['Iloilo City', 'Passi', 'Oton', 'Pavia', 'Leganes'],
  'Cagayan de Oro': ['Cagayan de Oro', 'Gingoog', 'Ozamiz', 'Tangub'],
  'Zamboanga': ['Zamboanga City', 'Pagadian', 'Dipolog'],
  'Bacolod': ['Bacolod', 'Talisay', 'Silay', 'Cadiz', 'Sagay'],
  'General Santos': ['General Santos', 'Koronadal', 'Tacurong'],
  'Butuan': ['Butuan', 'Cabadbaran', 'Bayugan'],
  'Iligan': ['Iligan', 'Marawi'],
  'Cotabato': ['Cotabato City', 'Kidapawan'],
  'Puerto Princesa': ['Puerto Princesa'],
  'Olongapo': ['Olongapo', 'Subic'],
  'Angeles': ['Angeles', 'San Fernando', 'Mabalacat'],
  'Antipolo': ['Antipolo', 'Cainta', 'Taytay'],
  'Tarlac': ['Tarlac City', 'Capas', 'Concepcion'],
  'Baguio': ['Baguio', 'La Trinidad', 'Itogon'],
  'Laoag': ['Laoag', 'Batac', 'Vigan'],
  'Tuguegarao': ['Tuguegarao', 'Cauayan', 'Ilagan'],
  'Legazpi': ['Legazpi', 'Tabaco', 'Ligao'],
  'Naga': ['Naga', 'Iriga', 'Goa'],
  'Tacloban': ['Tacloban', 'Ormoc', 'Maasin'],
  'Dumaguete': ['Dumaguete', 'Bais', 'Tanjay'],
  'Ilocos Sur': ['Vigan', 'Candon'],
  'La Union': ['San Fernando', 'Agoo', 'Bauang']
};

// Get weather for a specific city
router.get('/city/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        message: 'Weather API key not configured',
        mockData: {
          city: cityName,
          country: 'Philippines',
          temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
          description: 'Partly Cloudy',
          humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
          windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
          pressure: Math.floor(Math.random() * 20) + 1000, // 1000-1020 hPa
          icon: '02d',
          lastUpdated: new Date().toISOString()
        }
      });
    }

    // Use OpenWeatherMap API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName},PH&appid=${apiKey}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
      pressure: response.data.main.pressure,
      icon: response.data.weather[0].icon,
      lastUpdated: new Date().toISOString()
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error.message);
    
    // Return mock data if API fails
    res.json({
      city: req.params.cityName,
      country: 'Philippines',
      temperature: Math.floor(Math.random() * 10) + 25,
      description: 'Partly Cloudy',
      humidity: Math.floor(Math.random() * 30) + 60,
      windSpeed: Math.floor(Math.random() * 15) + 5,
      pressure: Math.floor(Math.random() * 20) + 1000,
      icon: '02d',
      lastUpdated: new Date().toISOString(),
      isMockData: true
    });
  }
});

// Get weather for multiple major cities
router.get('/major-cities', async (req, res) => {
  try {
    const majorCities = ['Manila', 'Cebu City', 'Davao City', 'Cagayan de Oro', 'Zamboanga City', 'Bacolod', 'Iloilo City', 'Baguio'];
    const weatherPromises = majorCities.map(city => {
      return new Promise(async (resolve) => {
        try {
          const apiKey = process.env.WEATHER_API_KEY;
          
          if (!apiKey) {
            resolve({
              city,
              country: 'Philippines',
              temperature: Math.floor(Math.random() * 10) + 25,
              description: 'Partly Cloudy',
              humidity: Math.floor(Math.random() * 30) + 60,
              windSpeed: Math.floor(Math.random() * 15) + 5,
              pressure: Math.floor(Math.random() * 20) + 1000,
              icon: '02d',
              lastUpdated: new Date().toISOString(),
              isMockData: true
            });
            return;
          }

          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},PH&appid=${apiKey}&units=metric`
          );

          resolve({
            city: response.data.name,
            country: response.data.sys.country,
            temperature: Math.round(response.data.main.temp),
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            windSpeed: Math.round(response.data.wind.speed * 3.6),
            pressure: response.data.main.pressure,
            icon: response.data.weather[0].icon,
            lastUpdated: new Date().toISOString()
          });
        } catch (error) {
          resolve({
            city,
            country: 'Philippines',
            temperature: Math.floor(Math.random() * 10) + 25,
            description: 'Partly Cloudy',
            humidity: Math.floor(Math.random() * 30) + 60,
            windSpeed: Math.floor(Math.random() * 15) + 5,
            pressure: Math.floor(Math.random() * 20) + 1000,
            icon: '02d',
            lastUpdated: new Date().toISOString(),
            isMockData: true
          });
        }
      });
    });

    const weatherData = await Promise.all(weatherPromises);
    res.json(weatherData);
  } catch (error) {
    console.error('Major cities weather error:', error);
    res.status(500).json({ message: 'Error fetching weather data for major cities' });
  }
});

// Get list of Philippine cities by province
router.get('/cities', (req, res) => {
  try {
    const { province } = req.query;

    if (province) {
      const cities = philippineCities[province] || [];
      res.json({ province, cities });
    } else {
      res.json(philippineCities);
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: 'Error fetching cities list' });
  }
});

// Get weather forecast (5-day)
router.get('/forecast/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      // Return mock forecast data
      const mockForecast = [];
      for (let i = 0; i < 5; i++) {
        mockForecast.push({
          date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          temperature: {
            min: Math.floor(Math.random() * 5) + 22,
            max: Math.floor(Math.random() * 8) + 28
          },
          description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 30) + 60,
          icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)]
        });
      }

      return res.json({
        city: cityName,
        country: 'Philippines',
        forecast: mockForecast,
        isMockData: true
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},PH&appid=${apiKey}&units=metric`
    );

    // Process 5-day forecast (take one reading per day at noon)
    const dailyForecasts = [];
    const processedDates = new Set();

    response.data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateString = date.toISOString().split('T')[0];
      
      // Take the forecast closest to noon each day
      if (!processedDates.has(dateString) && date.getHours() >= 11 && date.getHours() <= 13) {
        processedDates.add(dateString);
        dailyForecasts.push({
          date: dateString,
          temperature: {
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max)
          },
          description: item.weather[0].description,
          humidity: item.main.humidity,
          icon: item.weather[0].icon
        });
      }
    });

    res.json({
      city: response.data.city.name,
      country: response.data.city.country,
      forecast: dailyForecasts.slice(0, 5)
    });
  } catch (error) {
    console.error('Forecast API error:', error.message);
    
    // Return mock forecast data if API fails
    const mockForecast = [];
    for (let i = 0; i < 5; i++) {
      mockForecast.push({
        date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: {
          min: Math.floor(Math.random() * 5) + 22,
          max: Math.floor(Math.random() * 8) + 28
        },
        description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 30) + 60,
        icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)]
      });
    }

    res.json({
      city: req.params.cityName,
      country: 'Philippines',
      forecast: mockForecast,
      isMockData: true
    });
  }
});

module.exports = router;