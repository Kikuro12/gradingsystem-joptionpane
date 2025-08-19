import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  TextField,
  Autocomplete,
  Chip,
  Avatar,
  useTheme,
  Alert,
  Skeleton,
  Tab,
  Tabs
} from '@mui/material';
import {
  Cloud as CloudIcon,
  WbSunny as SunIcon,
  Opacity as HumidityIcon,
  Air as WindIcon,
  Thermostat as TempIcon,
  LocationOn,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import apiService from '../services/apiService';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityWeather, setCityWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [cities, setCities] = useState({});
  const [loading, setLoading] = useState(true);
  const [cityLoading, setCityLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  // Philippine cities data
  const philippineCities = [
    'Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig', 'Cebu City', 
    'Davao City', 'Cagayan de Oro', 'Zamboanga City', 'Bacolod', 'Iloilo City',
    'Baguio', 'General Santos', 'Butuan', 'Iligan', 'Cotabato City',
    'Puerto Princesa', 'Olongapo', 'Angeles', 'Antipolo', 'Tarlac City',
    'Laoag', 'Tuguegarao', 'Legazpi', 'Naga', 'Tacloban', 'Dumaguete',
    'Vigan', 'San Fernando', 'Bataan', 'Cabanatuan', 'Malolos'
  ];

  // Fetch major cities weather
  const fetchMajorCitiesWeather = async () => {
    setLoading(true);
    try {
      const response = await apiService.weather.getMajorCities();
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific city weather
  const fetchCityWeather = async (cityName) => {
    setCityLoading(true);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        apiService.weather.getByCity(cityName),
        apiService.weather.getForecast(cityName)
      ]);
      
      setCityWeather(weatherRes.data);
      setForecast(forecastRes.data.forecast || []);
    } catch (error) {
      console.error('Error fetching city weather:', error);
    } finally {
      setCityLoading(false);
    }
  };

  useEffect(() => {
    fetchMajorCitiesWeather();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchCityWeather(selectedCity);
    }
  }, [selectedCity]);

  // Get weather icon based on description
  const getWeatherIcon = (description, iconCode) => {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) {
      return <SunIcon sx={{ fontSize: 48, color: '#FFD700' }} />;
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
      return <CloudIcon sx={{ fontSize: 48, color: '#87CEEB' }} />;
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
      return <CloudIcon sx={{ fontSize: 48, color: '#4682B4' }} />;
    } else {
      return <CloudIcon sx={{ fontSize: 48, color: '#87CEEB' }} />;
    }
  };

  // Get temperature color
  const getTempColor = (temp) => {
    if (temp >= 35) return '#FF6B6B';
    if (temp >= 30) return '#FF8E53';
    if (temp >= 25) return '#4ECDC4';
    return '#45B7D1';
  };

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          🌤️ Philippine Weather
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Real-time weather updates for cities across the Philippines
        </Typography>
      </Box>

      {/* City Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <LocationOn color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Search City Weather
          </Typography>
        </Box>
        <Autocomplete
          options={philippineCities}
          value={selectedCity}
          onChange={(event, newValue) => setSelectedCity(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search for a Philippine city..."
              fullWidth
              variant="outlined"
            />
          )}
          sx={{ maxWidth: 400 }}
        />
      </Paper>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
          variant="fullWidth"
        >
          <Tab label="Major Cities" />
          <Tab label="City Details" disabled={!selectedCity} />
        </Tabs>
      </Paper>

      {/* Major Cities Tab */}
      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', my: 2 }} />
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : weatherData.length === 0 ? (
          <Alert severity="info">
            No weather data available. Please try again later.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {weatherData.map((weather, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${getTempColor(weather.temperature)} 0%, ${getTempColor(weather.temperature)}88 100%)`,
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => {
                    setSelectedCity(weather.city);
                    setTabValue(1);
                  }}
                  className="hover-card"
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    {/* City Name */}
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {weather.city}
                    </Typography>

                    {/* Weather Icon */}
                    <Box sx={{ mb: 2 }}>
                      {getWeatherIcon(weather.description, weather.icon)}
                    </Box>

                    {/* Temperature */}
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {weather.temperature}°C
                    </Typography>

                    {/* Description */}
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', mb: 2 }}>
                      {weather.description}
                    </Typography>

                    {/* Additional Info */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HumidityIcon fontSize="small" />
                        <span>{weather.humidity}%</span>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <WindIcon fontSize="small" />
                        <span>{weather.windSpeed} km/h</span>
                      </Box>
                    </Box>

                    {/* Mock Data Indicator */}
                    {weather.isMockData && (
                      <Chip
                        label="Demo Data"
                        size="small"
                        sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* City Details Tab */}
      <TabPanel value={tabValue} index={1}>
        {cityLoading ? (
          <LoadingSpinner message={`Loading weather for ${selectedCity}...`} />
        ) : cityWeather ? (
          <Grid container spacing={3}>
            {/* Current Weather */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${getTempColor(cityWeather.temperature)} 0%, ${getTempColor(cityWeather.temperature)}88 100%)`,
                  color: 'white',
                  height: '100%'
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {cityWeather.city}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    {getWeatherIcon(cityWeather.description, cityWeather.icon)}
                  </Box>

                  <Typography variant="h2" fontWeight="bold" sx={{ mb: 2 }}>
                    {cityWeather.temperature}°C
                  </Typography>

                  <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 3 }}>
                    {cityWeather.description}
                  </Typography>

                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Last updated: {new Date(cityWeather.lastUpdated).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Weather Details */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ py: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Weather Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <HumidityIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {cityWeather.humidity}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Humidity
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <WindIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {cityWeather.windSpeed}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          km/h
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <TempIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {cityWeather.pressure}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          hPa
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: getTempColor(cityWeather.temperature),
                            width: 32,
                            height: 32,
                            mx: 'auto',
                            mb: 1
                          }}
                        >
                          {cityWeather.country}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                          {cityWeather.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Country
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* 5-Day Forecast */}
            {forecast.length > 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      5-Day Forecast
                    </Typography>
                    <Grid container spacing={2}>
                      {forecast.map((day, index) => (
                        <Grid item xs={12} sm={6} md={2.4} key={index}>
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                              {new Date(day.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                            
                            <Box sx={{ mb: 1 }}>
                              {getWeatherIcon(day.description, day.icon)}
                            </Box>

                            <Typography variant="h6" fontWeight="bold">
                              {day.temperature.max}°/{day.temperature.min}°
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                              {day.description}
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                              {day.humidity}% humidity
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        ) : (
          <Alert severity="info">
            Select a city to view detailed weather information
          </Alert>
        )}
      </TabPanel>

      {/* Weather Tips */}
      <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Philippine Weather Tips
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              <strong>Dry Season (November to April):</strong> Generally sunny and dry weather. 
              Perfect time for outdoor activities and travel. Temperatures range from 25-35°C.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Wet Season (May to October):</strong> Expect frequent rainfall and higher humidity. 
              Typhoon season typically runs from June to November.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              <strong>Temperature:</strong> Philippines has a tropical climate with temperatures 
              rarely dropping below 20°C or exceeding 38°C.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Regional Variations:</strong> Northern Luzon experiences cooler temperatures, 
              while southern regions remain consistently warm year-round.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Weather;