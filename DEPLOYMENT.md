# 🚀 Deploy Kiur Hub to the Web

## Option 1: Railway (Recommended - Full-Stack)

Railway is perfect for deploying full-stack applications like Kiur Hub.

### Step 1: Prepare Your Code

```bash
# Make sure everything is committed to Git
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Deploy to Railway

1. **Sign up at Railway**
   - Go to https://railway.app
   - Sign up with GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your Kiur Hub repository

3. **Configure Environment Variables**
   In Railway dashboard, go to Variables tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kiur-hub
   JWT_SECRET=your-super-secure-production-secret
   CLIENT_URL=https://your-app-name.up.railway.app
   WEATHER_API_KEY=your-api-key (optional)
   GOOGLE_MAPS_API_KEY=your-api-key (optional)
   ```

4. **Add MongoDB Database**
   - In Railway dashboard, click "New Service"
   - Select "Database" → "MongoDB"
   - Copy the connection string to MONGODB_URI

5. **Deploy**
   - Railway automatically builds and deploys
   - Your app will be available at: `https://your-app-name.up.railway.app`

### Step 3: Set Up Database
```bash
# Connect to your deployed app and run setup
curl -X POST https://your-app-name.up.railway.app/api/setup
```

---

## Option 2: Vercel (Frontend) + Railway (Backend)

### Deploy Frontend to Vercel

1. **Prepare Frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set build command: `cd client && npm run build`
   - Set output directory: `client/build`

3. **Environment Variables in Vercel**
   ```
   REACT_APP_API_URL=https://your-backend.up.railway.app
   ```

### Deploy Backend to Railway
Follow Railway steps above but only deploy the server part.

---

## Option 3: Heroku (Alternative)

### Step 1: Install Heroku CLI
```bash
# Install Heroku CLI
npm install -g heroku
heroku login
```

### Step 2: Create Heroku App
```bash
heroku create kiur-hub-app
heroku addons:create mongolab:sandbox
```

### Step 3: Configure Environment
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set CLIENT_URL=https://kiur-hub-app.herokuapp.com
```

### Step 4: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

---

## Option 4: DigitalOcean App Platform

1. **Create Account**
   - Sign up at https://cloud.digitalocean.com

2. **Create New App**
   - Choose "GitHub" as source
   - Select your repository

3. **Configure Build**
   - Build Command: `npm run build`
   - Run Command: `npm start`

4. **Add Database**
   - Add MongoDB database component
   - Update MONGODB_URI environment variable

---

## Option 5: Netlify (Frontend Only)

Perfect for static deployment of the React frontend:

1. **Build Frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Drag and drop the `client/build` folder
   - Or connect GitHub repository

3. **Configure Redirects**
   Create `client/public/_redirects`:
   ```
   /api/* https://your-backend-url.com/api/:splat 200
   /* /index.html 200
   ```

---

## 🗄️ Database Options

### MongoDB Atlas (Recommended)
1. Create account at https://mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Use in MONGODB_URI environment variable

### Railway MongoDB
- Automatically provisioned with Railway deployment
- Copy connection string from Railway dashboard

### Heroku MongoDB
```bash
heroku addons:create mongolab:sandbox
```

---

## 🔧 Production Environment Variables

Create these environment variables in your hosting platform:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kiur-hub
JWT_SECRET=your-super-secure-production-jwt-secret-at-least-32-characters
CLIENT_URL=https://your-domain.com
WEATHER_API_KEY=your-openweathermap-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## 🌐 Custom Domain (Optional)

### For Railway:
1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown

### For Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS

### For Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

---

## 📊 Post-Deployment Setup

### 1. Initialize Database
Visit your deployed app and run:
```
https://your-app.com/api/setup
```

### 2. Create Admin Account
```bash
curl -X POST https://your-app.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@yourdomain.com",
    "password": "your-secure-password",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

### 3. Test All Features
- ✅ Homepage loads
- ✅ User registration/login
- ✅ Document center
- ✅ Weather system
- ✅ Interactive map
- ✅ Forum functionality
- ✅ Real-time chat
- ✅ Admin panel

---

## 🔒 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] Environment variables secured
- [ ] Database password protected
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation active

---

## 📈 Monitoring & Maintenance

### Railway:
- Built-in metrics and logs
- Automatic deployments from Git

### Heroku:
- Heroku logs: `heroku logs --tail`
- Add monitoring: `heroku addons:create newrelic:wayne`

### General:
- Monitor API response times
- Check database performance
- Monitor error rates
- Regular security updates

---

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json

2. **Database Connection**
   - Verify MONGODB_URI is correct
   - Check database user permissions
   - Ensure IP whitelist includes 0.0.0.0/0

3. **Environment Variables**
   - Double-check all required variables are set
   - Restart application after changing variables

4. **CORS Issues**
   - Update CLIENT_URL to match your domain
   - Check CORS configuration in server code

### Getting Help:
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Heroku: https://devcenter.heroku.com
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

## 🎉 Success!

Your Kiur Hub is now live on the web! 🌐

**Next Steps:**
1. Share your website URL
2. Add custom domain
3. Set up monitoring
4. Regular backups
5. Performance optimization

**Your live Kiur Hub features:**
- 📄 Document downloads
- 🌤️ Live weather
- 🗺️ Interactive maps  
- 💬 Community forum
- 💬 Real-time chat
- 🛡️ Admin panel

*Para sa bayan, para sa kinabukasan!* 🇵🇭