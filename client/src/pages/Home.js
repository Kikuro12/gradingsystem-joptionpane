import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Description as DocumentIcon,
  Cloud as WeatherIcon,
  Map as MapIcon,
  Forum as ForumIcon,
  Download as DownloadIcon,
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import apiService from '../services/apiService';

const Home = () => {
  const [featuredDocuments, setFeaturedDocuments] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [documentsRes, weatherRes, forumRes] = await Promise.all([
          apiService.documents.getFeatured(),
          apiService.weather.getMajorCities(),
          apiService.forum.getPosts({ limit: 5, sort: 'newest' })
        ]);

        setFeaturedDocuments(documentsRes.data.featured.slice(0, 6));
        setWeatherData(weatherRes.data.slice(0, 4));
        setForumPosts(forumRes.data.posts);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const features = [
    {
      icon: <DocumentIcon sx={{ fontSize: 40 }} />,
      title: 'Document Center',
      description: 'Access thousands of government forms, legal documents, and personal forms - all free to download and print.',
      color: '#1976d2',
      path: '/documents'
    },
    {
      icon: <WeatherIcon sx={{ fontSize: 40 }} />,
      title: 'Live Weather',
      description: 'Get real-time weather updates for all Philippine cities and provinces with detailed forecasts.',
      color: '#2196f3',
      path: '/weather'
    },
    {
      icon: <MapIcon sx={{ fontSize: 40 }} />,
      title: 'Interactive Maps',
      description: 'Explore the Philippines with our interactive map featuring locations and services.',
      color: '#4caf50',
      path: '/maps'
    },
    {
      icon: <ForumIcon sx={{ fontSize: 40 }} />,
      title: 'Community Forum',
      description: 'Connect with fellow Filipinos, ask questions, and share knowledge in our active community.',
      color: '#ff9800',
      path: '/forum'
    }
  ];

  const stats = [
    { icon: <DocumentIcon />, label: 'Documents', value: '1,000+', color: '#1976d2' },
    { icon: <PeopleIcon />, label: 'Active Users', value: '50,000+', color: '#2196f3' },
    { icon: <DownloadIcon />, label: 'Downloads', value: '500,000+', color: '#4caf50' },
    { icon: <TrendingIcon />, label: 'Growth', value: '+25%', color: '#ff9800' }
  ];

  if (loading) {
    return <LoadingSpinner message="Loading Kiur Hub..." />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #90caf9 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                fontWeight="bold"
                gutterBottom
                className="fade-in"
              >
                Welcome to Kiur Hub
              </Typography>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{ mb: 3, opacity: 0.95 }}
                className="fade-in"
              >
                Your one-stop platform for free Philippine government documents, 
                weather updates, maps, and community discussions.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/documents')}
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                  endIcon={<ArrowIcon />}
                >
                  Explore Documents
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/forum')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Join Community
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 200, md: 300 }
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '4rem', md: '8rem' },
                    opacity: 0.3,
                    userSelect: 'none'
                  }}
                >
                  🇵🇭
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
                  }
                }}
                className="hover-card"
              >
                <Avatar
                  sx={{
                    bgcolor: stat.color,
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color={stat.color}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Everything You Need in One Place
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => navigate(feature.path)}
                  className="hover-card"
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: feature.color,
                          width: 60,
                          height: 60,
                          mr: 2
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h5" fontWeight="bold">
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 4, pt: 0 }}>
                    <Button
                      size="large"
                      sx={{ color: feature.color, fontWeight: 'bold' }}
                      endIcon={<ArrowIcon />}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Documents Section */}
      {featuredDocuments.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Featured Documents
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/documents')}
              endIcon={<ArrowIcon />}
            >
              View All
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {featuredDocuments.map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc._id}>
                <Card
                  className="document-card hover-card"
                  onClick={() => navigate(`/documents/${doc._id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Chip
                        label={doc.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <StarIcon color="warning" />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {doc.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {doc.description.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DownloadIcon fontSize="small" />
                      <Typography variant="body2">
                        {doc.downloadCount} downloads
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Weather Widget */}
      {weatherData.length > 0 && (
        <Box sx={{ bgcolor: 'background.default', py: 6 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" fontWeight="bold">
                Philippine Weather
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/weather')}
                endIcon={<ArrowIcon />}
              >
                View All Cities
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {weatherData.map((weather, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Paper
                    className="weather-widget"
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                      color: 'white',
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                    onClick={() => navigate('/weather')}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {weather.city}
                    </Typography>
                    <Typography variant="h3" sx={{ my: 1 }}>
                      {weather.temperature}°C
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {weather.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Recent Forum Posts */}
      {forumPosts.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Latest Discussions
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/forum')}
              endIcon={<ArrowIcon />}
            >
              View Forum
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {forumPosts.map((post) => (
              <Grid item xs={12} md={6} key={post._id}>
                <Card
                  className="hover-card"
                  sx={{ cursor: 'pointer', height: '100%' }}
                  onClick={() => navigate(`/forum/posts/${post._id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                        {post.author.firstName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {post.author.firstName} {post.author.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.content.substring(0, 150)}...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={post.category} size="small" />
                      <Chip
                        label={`${post.replies.length} replies`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${post.likes.length} likes`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default Home;