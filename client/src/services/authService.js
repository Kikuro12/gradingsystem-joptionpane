import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add token to requests if available
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      return user;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (loginData) => {
    try {
      const response = await axios.post('/auth/login', loginData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      return user;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await axios.get('/auth/profile');
      return response.data.user;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await axios.put('/auth/profile', userData);
      return response.data.user;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await axios.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password change failed' };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await axios.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token verification failed' };
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;