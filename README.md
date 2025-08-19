# 🇵🇭 Kiur Hub - Philippine Document Center

A comprehensive web platform providing free access to downloadable and printable Philippine government and personal documents, along with weather updates, interactive maps, and community discussions.

## ✨ Features

### 📄 Document Center
- **Extensive Library**: Access to thousands of government forms, legal documents, and personal paperwork
- **Smart Search**: Advanced filtering by category, tags, and content
- **Download & Print**: PDF and DOC formats optimized for printing
- **User Uploads**: Community-contributed documents with admin approval
- **Categories**: Government Forms, Legal Documents, Business Forms, Educational Documents, Health Forms, Tax Documents, and more

### 🌤️ Live Weather System
- **Real-time Updates**: Current weather for all Philippine cities and provinces
- **5-Day Forecasts**: Detailed weather predictions
- **Interactive Interface**: Beautiful weather widgets with Filipino-inspired design
- **Major Cities**: Quick access to weather for Manila, Cebu, Davao, and other key cities

### 🗺️ Interactive Philippines Map
- **OpenStreetMap Integration**: Detailed map of the Philippines with all regions
- **City Information**: Population, services, and regional details
- **Location Search**: Find cities, provinces, and points of interest
- **User Location**: GPS-based location detection

### 💬 Community Forum
- **Discussion Categories**: General Discussion, Document Help, Technical Support, Announcements
- **User Interaction**: Post, reply, like, and share knowledge
- **Admin Moderation**: Pin important posts, lock discussions, manage content
- **Real-time Updates**: Live notifications and activity feeds

### 💬 Real-time Chat Support
- **Live Chatbox**: Instant help and guidance from admins and community
- **Socket.io Integration**: Real-time messaging with typing indicators
- **Message History**: Persistent chat history with search functionality
- **Admin Support**: Dedicated support channels with admin responses

### 🛡️ Admin Panel
- **Dashboard**: Comprehensive system statistics and analytics
- **User Management**: Manage users, roles, and permissions
- **Document Approval**: Review and approve user-submitted documents
- **Forum Moderation**: Pin, lock, and manage forum posts
- **System Settings**: Configure site settings, announcements, and features

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: User and admin role management
- **Password Encryption**: Bcrypt hashing for secure password storage
- **Input Validation**: Comprehensive validation and sanitization
- **Rate Limiting**: API rate limiting for security

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.io** - Real-time communication
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware

### Frontend
- **React 18** - Modern UI library with hooks
- **Material-UI (MUI)** - Professional React components
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **React Leaflet** - Interactive maps
- **React Toastify** - Notifications
- **Moment.js** - Date manipulation

### Additional Features
- **Responsive Design** - Mobile-first approach with Material-UI
- **Progressive Web App** - PWA capabilities with service workers
- **SEO Optimized** - Meta tags and structured data
- **Filipino Theme** - Colors and design inspired by Philippine flag
- **Performance Optimized** - Code splitting and lazy loading

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB 4.4+
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kiur-hub
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   # Required: MongoDB URI, JWT secret
   # Optional: Weather API key, Google Maps API key
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Development mode (both server and client)
   npm run dev
   
   # Or run separately
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
kiur-hub/
├── server/                 # Backend application
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── controllers/       # Route controllers
│   ├── uploads/          # File upload storage
│   └── index.js          # Server entry point
├── client/               # Frontend application
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/      # Page components
│       ├── services/   # API services
│       ├── styles/     # CSS and styling
│       └── utils/      # Utility functions
├── package.json         # Server dependencies
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/kiur-hub

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# External APIs (Optional)
WEATHER_API_KEY=your-openweathermap-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Client Configuration
CLIENT_URL=http://localhost:3000
```

### Weather API Setup (Optional)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add to `.env` file as `WEATHER_API_KEY`

### Google Maps API Setup (Optional)
1. Create project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Create API key with appropriate restrictions
4. Add to `.env` file as `GOOGLE_MAPS_API_KEY`

## 🚀 Deployment

### Production Build
```bash
# Build client for production
cd client && npm run build

# Start production server
npm start
```

### Environment Setup
- Set `NODE_ENV=production`
- Use production MongoDB instance
- Configure secure JWT secret
- Set up SSL/HTTPS
- Configure domain and CORS settings

### Recommended Hosting
- **Backend**: Railway, Heroku, DigitalOcean App Platform
- **Database**: MongoDB Atlas, Railway PostgreSQL
- **Frontend**: Netlify, Vercel, GitHub Pages
- **Files**: AWS S3, Cloudinary, Railway Volumes

## 👥 User Roles

### Regular Users
- Browse and download documents
- Participate in forum discussions
- Use weather and map features
- Manage personal profile
- Upload documents (pending admin approval)

### Administrators
- All user permissions
- Approve/reject document uploads
- Moderate forum discussions
- Manage user accounts and roles
- Access admin dashboard and analytics
- Configure system settings

## 🎨 Design Philosophy

### Filipino-Inspired Theme
- **Colors**: Blue and red from Philippine flag (#1976d2, #dc004e)
- **Typography**: Clean, modern fonts optimized for Filipino content
- **Icons**: Intuitive symbols representing Philippine services
- **Layout**: Mobile-first design for widespread accessibility

### User Experience
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Performance**: Optimized loading with lazy loading and caching
- **Responsive**: Seamless experience across all device sizes
- **Intuitive**: Clear navigation and user-friendly interfaces

## 🤝 Contributing

We welcome contributions from the Filipino developer community!

### Development Setup
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and test thoroughly
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Create Pull Request

### Contribution Guidelines
- Follow existing code style and patterns
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Document Endpoints
- `GET /api/documents` - List documents with filtering
- `GET /api/documents/:id` - Get single document
- `GET /api/documents/:id/download` - Download document
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/categories` - Get categories

### Weather Endpoints
- `GET /api/weather/city/:name` - Get city weather
- `GET /api/weather/major-cities` - Get major cities weather
- `GET /api/weather/forecast/:name` - Get weather forecast

### Forum Endpoints
- `GET /api/forum/posts` - List forum posts
- `GET /api/forum/posts/:id` - Get single post
- `POST /api/forum/posts` - Create new post
- `POST /api/forum/posts/:id/replies` - Add reply

## 🔒 Security Features

- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive data validation
- **File Upload**: Secure file handling with type validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Configured Cross-Origin Resource Sharing
- **Helmet**: Security headers for protection
- **Password Hashing**: Bcrypt for secure password storage

## 📊 Performance Optimizations

- **Code Splitting**: React lazy loading for reduced bundle size
- **Image Optimization**: Compressed images and lazy loading
- **Caching**: Browser caching and API response caching
- **Database Indexing**: Optimized MongoDB queries
- **CDN Ready**: Static assets optimized for CDN delivery
- **Minification**: Production builds with minified assets

## 🌟 Future Enhancements

- **Mobile App**: React Native mobile application
- **Push Notifications**: Real-time notifications for updates
- **Advanced Search**: Full-text search with Elasticsearch
- **Multi-language**: Support for Filipino languages
- **AI Integration**: Document classification and recommendations
- **Blockchain**: Document verification and authenticity
- **Analytics**: Advanced user behavior analytics
- **Social Features**: User profiles and social interactions

## 📞 Support

For support, questions, or suggestions:

- **Email**: support@kiurhub.ph
- **Forum**: Use the community forum for public discussions
- **Issues**: GitHub Issues for bug reports and feature requests
- **Documentation**: Check this README and inline code comments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Created by**: Marwen Deiparine
- **Inspiration**: Filipino community needs for accessible government documents
- **Contributors**: Thanks to all contributors who help improve Kiur Hub
- **Open Source**: Built with amazing open-source technologies
- **Community**: Special thanks to the Filipino developer community

---

**Kiur Hub** - Empowering Filipinos with free access to essential documents and community resources. 🇵🇭

*Para sa bayan, para sa kinabukasan!* (For the country, for the future!)