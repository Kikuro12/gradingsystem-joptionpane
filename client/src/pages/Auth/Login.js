import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Person
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const user = await authService.login(data);
      onLogin(user);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '60vh'
        }}
      >
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Sign in to Kiur Hub
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email or Username"
              margin="normal"
              {...register('login', {
                required: 'Email or username is required'
              })}
              error={!!errors.login}
              helperText={errors.login?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              {...register('password', {
                required: 'Password is required'
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 3,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                New to Kiur Hub?
              </Typography>
            </Divider>

            <Button
              component={RouterLink}
              to="/register"
              fullWidth
              variant="outlined"
              size="large"
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Create Account
            </Button>
          </form>
        </Paper>

        {/* Features Preview */}
        <Box sx={{ mt: 4, width: '100%' }}>
          <Typography variant="h6" textAlign="center" gutterBottom>
            What you can do with Kiur Hub
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              'Download Documents',
              'Join Discussions',
              'Get Weather Updates',
              'Explore Maps'
            ].map((feature, index) => (
              <Card key={index} sx={{ minWidth: 120, textAlign: 'center' }}>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="body2" fontWeight="500">
                    {feature}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Footer Links */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            By signing in, you agree to our{' '}
            <Link href="/terms" underline="hover">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" underline="hover">
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;