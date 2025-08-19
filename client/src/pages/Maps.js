import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Autocomplete,
  Chip,
  Button,
  IconButton,
  useTheme
} from '@mui/material';
import {
  LocationOn,
  Search,
  MyLocation,
  Layers,
  Info,
  Phone,
  Language,
  Business
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Philippine regions and major cities
const philippineLocations = [
  {
    name: 'Manila',
    region: 'National Capital Region (NCR)',
    coordinates: [14.5995, 120.9842],
    type: 'Capital',
    population: '1.78M',
    description: 'Capital city of the Philippines',
    services: ['Government Offices', 'Hospitals', 'Universities', 'Business Centers']
  },
  {
    name: 'Quezon City',
    region: 'National Capital Region (NCR)',
    coordinates: [14.6760, 121.0437],
    type: 'City',
    population: '2.96M',
    description: 'Most populous city in the Philippines',
    services: ['Shopping Malls', 'Universities', 'Government Offices', 'Entertainment']
  },
  {
    name: 'Cebu City',
    region: 'Central Visayas (Region VII)',
    coordinates: [10.3157, 123.8854],
    type: 'City',
    population: '922K',
    description: 'Queen City of the South',
    services: ['Port', 'Airport', 'Business Centers', 'Tourism']
  },
  {
    name: 'Davao City',
    region: 'Davao Region (Region XI)',
    coordinates: [7.1907, 125.4553],
    type: 'City',
    population: '1.63M',
    description: 'Largest city in the Philippines by land area',
    services: ['Airport', 'Port', 'Agriculture', 'Tourism']
  },
  {
    name: 'Cagayan de Oro',
    region: 'Northern Mindanao (Region X)',
    coordinates: [8.4542, 124.6319],
    type: 'City',
    population: '728K',
    description: 'City of Golden Friendship',
    services: ['Port', 'Universities', 'Business', 'Tourism']
  },
  {
    name: 'Zamboanga City',
    region: 'Zamboanga Peninsula (Region IX)',
    coordinates: [6.9214, 122.0790],
    type: 'City',
    population: '977K',
    description: 'Asia\'s Latin City',
    services: ['Port', 'Military Base', 'Tourism', 'Fishing']
  },
  {
    name: 'Bacolod',
    region: 'Western Visayas (Region VI)',
    coordinates: [10.6770, 122.9540],
    type: 'City',
    population: '600K',
    description: 'City of Smiles',
    services: ['Sugar Industry', 'Tourism', 'Education', 'Business']
  },
  {
    name: 'Iloilo City',
    region: 'Western Visayas (Region VI)',
    coordinates: [10.7202, 122.5621],
    type: 'City',
    population: '457K',
    description: 'City of Love',
    services: ['Port', 'Universities', 'Business', 'Tourism']
  },
  {
    name: 'Baguio',
    region: 'Cordillera Administrative Region (CAR)',
    coordinates: [16.4023, 120.5960],
    type: 'City',
    population: '366K',
    description: 'Summer Capital of the Philippines',
    services: ['Tourism', 'Education', 'Cool Climate', 'Mountain Resort']
  },
  {
    name: 'General Santos',
    region: 'SOCCSKSARGEN (Region XII)',
    coordinates: [6.1164, 125.1716],
    type: 'City',
    population: '697K',
    description: 'Tuna Capital of the Philippines',
    services: ['Fishing Industry', 'Port', 'Airport', 'Business']
  }
];

// Component to handle map centering
const MapController = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 10);
    }
  }, [center, map]);

  return null;
};

const Maps = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [mapCenter, setMapCenter] = useState([12.8797, 121.7740]); // Center of Philippines
  const [userLocation, setUserLocation] = useState(null);
  const theme = useTheme();

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setMapCenter(location.coordinates);
  };

  // Custom marker icon
  const createCustomIcon = (type) => {
    const color = type === 'Capital' ? '#dc004e' : '#1976d2';
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-div-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom textAlign="center">
        🗺️ Philippines Interactive Map
      </Typography>
      <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Explore cities, regions, and services across the beautiful Philippines
      </Typography>

      <Grid container spacing={3}>
        {/* Left Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Search color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Search Locations
              </Typography>
            </Box>
            
            <Autocomplete
              options={philippineLocations}
              getOptionLabel={(option) => `${option.name}, ${option.region}`}
              value={selectedLocation}
              onChange={(event, newValue) => {
                handleLocationSelect(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search for cities, regions..."
                  fullWidth
                  variant="outlined"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {option.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.region}
                    </Typography>
                  </Box>
                </Box>
              )}
              sx={{ mb: 2 }}
            />

            <Button
              variant="outlined"
              startIcon={<MyLocation />}
              onClick={getCurrentLocation}
              fullWidth
              sx={{ mb: 3 }}
            >
              Use My Location
            </Button>

            {/* Location Details */}
            {selectedLocation && (
              <Card elevation={1} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {selectedLocation.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {selectedLocation.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={selectedLocation.type} 
                      color="primary" 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={selectedLocation.population} 
                      variant="outlined" 
                      size="small" 
                    />
                  </Box>

                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Available Services:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedLocation.services.map((service, index) => (
                      <Chip
                        key={index}
                        label={service}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <Layers sx={{ mr: 1 }} />
                Legend
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: '#dc004e',
                        border: '2px solid white',
                        boxShadow: 1
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Capital City" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: '#1976d2',
                        border: '2px solid white',
                        boxShadow: 1
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Major Cities" />
                </ListItem>
              </List>
            </Paper>
          </Paper>
        </Grid>

        {/* Map Container */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 2, height: 600 }}>
            <MapContainer
              center={mapCenter}
              zoom={6}
              style={{ height: '100%', width: '100%', borderRadius: 8 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapController center={mapCenter} />

              {/* Location Markers */}
              {philippineLocations.map((location, index) => (
                <Marker
                  key={index}
                  position={location.coordinates}
                  icon={createCustomIcon(location.type)}
                  eventHandlers={{
                    click: () => handleLocationSelect(location)
                  }}
                >
                  <Popup>
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {location.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {location.region}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {location.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip label={location.type} size="small" color="primary" />
                        <Chip label={location.population} size="small" variant="outlined" />
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        Services:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {location.services.slice(0, 3).map((service, idx) => (
                          <Chip
                            key={idx}
                            label={service}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Popup>
                </Marker>
              ))}

              {/* User Location Marker */}
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>
                    <Typography variant="body2">
                      Your Current Location
                    </Typography>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </Paper>

          {/* Quick Info Cards */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Card elevation={1}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Info color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    7,641
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Islands
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={1}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Business color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    17
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Regions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={1}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Language color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    180+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Languages
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          About Philippine Geography
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              The Philippines is an archipelagic country in Southeast Asia consisting of 7,641 islands. 
              It is divided into three main geographical divisions: Luzon, Visayas, and Mindanao.
            </Typography>
            <Typography variant="body1" paragraph>
              The country has 17 regions, 81 provinces, 146 cities, and 1,488 municipalities. 
              Each region has its own unique culture, languages, and attractions.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              Major urban centers include Metro Manila (National Capital Region), Metro Cebu, 
              and Metro Davao. These areas serve as economic, educational, and cultural hubs.
            </Typography>
            <Typography variant="body1" paragraph>
              The Philippines is known for its tropical climate, beautiful beaches, rich biodiversity, 
              and warm, hospitable people.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Maps;