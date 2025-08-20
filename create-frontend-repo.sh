#!/bin/bash

echo "🎯 Creating Frontend-Only Repository for Vercel"
echo "=============================================="

# Create a new directory for frontend-only deployment
mkdir -p ../kiur-hub-frontend
cd ../kiur-hub-frontend

# Copy client files
cp -r ../kiur-hub/client/* .
cp ../kiur-hub/client/.* . 2>/dev/null || true

# Create new package.json for root level
cat > package.json << 'EOL'
{
  "name": "kiur-hub-frontend",
  "version": "1.0.0",
  "description": "Kiur Hub - Philippine Document Center (Frontend)",
  "private": true,
  "homepage": ".",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "axios": "^1.5.0",
    "socket.io-client": "^4.7.2",
    "@mui/material": "^5.14.5",
    "@mui/icons-material": "^5.14.3",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "react-query": "^3.39.3",
    "react-hook-form": "^7.45.4",
    "react-toastify": "^9.1.3",
    "moment": "^2.29.4",
    "file-saver": "^2.0.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "react-scripts": "5.0.1",
    "@types/leaflet": "^1.9.4"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOL

# Create Vercel configuration
cat > vercel.json << 'EOL'
{
  "version": 2,
  "name": "kiur-hub",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": "create-react-app",
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@api_url"
  }
}
EOL

# Create README
cat > README.md << 'EOL'
# Kiur Hub Frontend

This is the frontend-only version of Kiur Hub for Vercel deployment.

## Deployment to Vercel

1. Push this repository to GitHub
2. Connect to Vercel
3. Add environment variable: `REACT_APP_API_URL` = your backend URL
4. Deploy!

## Backend

Deploy the backend separately to Railway, Heroku, or other Node.js hosting.
EOL

# Initialize git
git init
git add .
git commit -m "Initial frontend-only commit for Vercel deployment"

echo ""
echo "✅ Frontend repository created in ../kiur-hub-frontend"
echo ""
echo "📋 Next steps:"
echo "1. cd ../kiur-hub-frontend"
echo "2. Create new GitHub repository"
echo "3. git remote add origin <your-new-repo-url>"
echo "4. git push -u origin main"
echo "5. Deploy to Vercel from the new repository"
echo ""
echo "🔧 Don't forget to:"
echo "- Add REACT_APP_API_URL environment variable in Vercel"
echo "- Deploy backend separately (Railway recommended)"

cd ../kiur-hub