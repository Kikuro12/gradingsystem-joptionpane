import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
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

const apiService = {
  // Documents
  documents: {
    getAll: (params = {}) => api.get('/documents', { params }),
    getById: (id) => api.get(`/documents/${id}`),
    getCategories: () => api.get('/documents/categories'),
    getFeatured: () => api.get('/documents/featured'),
    download: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
    upload: (formData) => api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/documents/${id}`, data),
    delete: (id) => api.delete(`/documents/${id}`)
  },

  // Forum
  forum: {
    getPosts: (params = {}) => api.get('/forum/posts', { params }),
    getPost: (id) => api.get(`/forum/posts/${id}`),
    getCategories: () => api.get('/forum/categories'),
    createPost: (data) => api.post('/forum/posts', data),
    updatePost: (id, data) => api.put(`/forum/posts/${id}`, data),
    deletePost: (id) => api.delete(`/forum/posts/${id}`),
    addReply: (id, data) => api.post(`/forum/posts/${id}/replies`, data),
    likePost: (id) => api.post(`/forum/posts/${id}/like`),
    likeReply: (postId, replyId) => api.post(`/forum/posts/${postId}/replies/${replyId}/like`)
  },

  // Weather
  weather: {
    getByCity: (city) => api.get(`/weather/city/${city}`),
    getMajorCities: () => api.get('/weather/major-cities'),
    getCities: (province) => api.get('/weather/cities', { params: { province } }),
    getForecast: (city) => api.get(`/weather/forecast/${city}`)
  },

  // Chat
  chat: {
    getMessages: (params = {}) => api.get('/chat/messages', { params }),
    sendMessage: (data) => api.post('/chat/messages', data),
    markAsRead: (messageIds) => api.put('/chat/messages/read', { messageIds }),
    getUnreadCount: () => api.get('/chat/unread-count'),
    deleteMessage: (id) => api.delete(`/chat/messages/${id}`),
    getStats: () => api.get('/chat/stats')
  },

  // Admin
  admin: {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params = {}) => api.get('/admin/users', { params }),
    updateUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
    updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
    getPendingDocuments: (params = {}) => api.get('/admin/documents/pending', { params }),
    approveDocument: (id, data) => api.put(`/admin/documents/${id}/approval`, data),
    getForumPosts: (params = {}) => api.get('/admin/forum/posts', { params }),
    pinPost: (id) => api.put(`/admin/forum/posts/${id}/pin`),
    lockPost: (id) => api.put(`/admin/forum/posts/${id}/lock`),
    deleteForumPost: (id) => api.delete(`/admin/forum/posts/${id}`),
    getSettings: () => api.get('/admin/settings'),
    updateSettings: (data) => api.put('/admin/settings', data)
  }
};

export default apiService;