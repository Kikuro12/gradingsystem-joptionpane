# 🚂 Railway Deployment Guide - Fixed

## ✅ Problem Fixed

The `cd client && npm run build` error has been resolved with proper Railway configuration files.

## 🚀 Deploy to Railway (Step-by-Step)

### Step 1: Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main
```

### Step 2: Deploy to Railway

1. **Go to Railway**
   - Visit: https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `kiur-hub` repository
   - Railway will automatically detect it as a Node.js app

3. **Railway will automatically:**
   - ✅ Install server dependencies
   - ✅ Install client dependencies  
   - ✅ Build React frontend
   - ✅ Start the Node.js server

### Step 3: Add Environment Variables

In your Railway project dashboard, go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=$PORT
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kiur-hub
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long
CLIENT_URL=https://your-app-name.up.railway.app
WEATHER_API_KEY=your-openweathermap-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

**Important Notes:**
- `PORT=$PORT` - Railway automatically sets this
- Replace `your-app-name` with your actual Railway app name
- JWT_SECRET should be at least 32 characters long

### Step 4: Add MongoDB Database

**Option A: Railway MongoDB (Recommended)**
1. In Railway dashboard, click "New Service"
2. Select "Database" → "MongoDB" 
3. Railway will create a MongoDB instance
4. Copy the connection string from Variables tab
5. Use it as your `MONGODB_URI`

**Option B: MongoDB Atlas**
1. Create account at https://mongodb.com/atlas
2. Create free cluster (512MB)
3. Get connection string
4. Add to `MONGODB_URI` variable

### Step 5: Deploy and Initialize

1. **Deploy**
   - Railway automatically deploys after you add variables
   - Check the deployment logs for any errors
   - Your app will be available at: `https://your-app-name.up.railway.app`

2. **Initialize Database**
   ```bash
   # Run this once after successful deployment
   curl -X POST https://your-app-name.up.railway.app/api/setup/initialize
   ```

   This creates:
   - Admin account: `admin@kiurhub.ph` / `admin123`
   - Sample documents
   - Database indexes

### Step 6: Test Your Deployment

Visit your Railway URL and test:
- ✅ Homepage loads
- ✅ User registration/login works
- ✅ Documents page shows sample documents
- ✅ Weather page displays Philippine cities
- ✅ Maps page shows interactive Philippines map
- ✅ Forum allows posting (after login)
- ✅ Real-time chat works
- ✅ Admin panel accessible (admin login)

## 🔧 Configuration Files Explained

### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ['nodejs-18_x', 'npm-9_x']

[phases.install]
cmds = [
  'npm ci --include=dev',
  'cd client && npm ci --include=dev'
]

[phases.build]
cmds = [
  'cd client && npm run build'
]

[start]
cmd = 'npm start'
```
This tells Railway exactly how to build your full-stack app.

### `railway.json`
Provides Railway-specific deployment configuration.

### Updated `package.json`
- Fixed build commands
- Proper postinstall script

## 🆘 Troubleshooting

### Build Still Failing?

1. **Check Railway Logs**
   - Go to your Railway project
   - Click "Deployments" tab
   - Click on the failed deployment
   - Check build and deploy logs

2. **Common Issues:**

   **"Cannot find module 'client'"**
   ```bash
   # Make sure client directory exists in your repo
   ls -la client/
   ```

   **"npm ERR! missing script: build"**
   ```bash
   # Check client/package.json has build script
   cat client/package.json | grep -A5 '"scripts"'
   ```

   **"MongoDB connection failed"**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB service is running
   - Ensure IP whitelist includes `0.0.0.0/0`

3. **Force Redeploy**
   - In Railway dashboard
   - Go to Deployments
   - Click "Redeploy" on latest deployment

### Environment Variables Not Working?

1. **Check Variable Names**
   - No typos in variable names
   - Use exact names from the list above

2. **Restart Service**
   - After adding variables, Railway auto-restarts
   - Or manually restart from Settings

### Database Connection Issues?

1. **Railway MongoDB**
   ```bash
   # Connection string format:
   mongodb://mongo:password@monorail.proxy.rlwy.net:port/railway
   ```

2. **MongoDB Atlas**
   ```bash
   # Make sure to:
   # - Whitelist IP: 0.0.0.0/0 
   # - Create database user
   # - Use correct database name
   ```

## 🎉 Success!

When deployment succeeds, you'll see:

```
✅ Build completed successfully
✅ Deployment live at: https://your-app.up.railway.app
✅ Health check passing
```

**Your Kiur Hub is now live!** 🌐

### Next Steps:
1. **Change Admin Password** - Login and update default credentials
2. **Add Custom Domain** - Optional: Connect your own domain
3. **Monitor Performance** - Check Railway metrics
4. **Upload Real Documents** - Replace sample documents with actual forms

### Admin Access:
- URL: `https://your-app.up.railway.app`
- Email: `admin@kiurhub.ph`
- Password: `admin123` (change immediately!)

**🇵🇭 Your Filipino document center is now serving the community!**

---

## 📞 Still Need Help?

If you're still having issues:

1. **Check Railway Status**: https://status.railway.app
2. **Railway Docs**: https://docs.railway.app
3. **Railway Discord**: https://discord.gg/railway
4. **Check this repo's issues**: For Kiur Hub specific problems

The configuration is now properly set up for Railway's build system! 🚂