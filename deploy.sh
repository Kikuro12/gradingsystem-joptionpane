#!/bin/bash

echo "🚀 Kiur Hub Deployment Script"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Kiur Hub v1.0"
fi

echo ""
echo "🌐 Choose your deployment option:"
echo "1. Railway (Recommended - Full-stack)"
echo "2. Vercel (Frontend only)"
echo "3. Netlify (Frontend only)"
echo "4. Heroku (Full-stack)"
echo "5. Manual deployment guide"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚂 Railway Deployment"
        echo "===================="
        echo "1. Go to https://railway.app"
        echo "2. Sign up with your GitHub account"
        echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "4. Select this repository"
        echo "5. Add these environment variables in Railway dashboard:"
        echo ""
        echo "   NODE_ENV=production"
        echo "   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kiur-hub"
        echo "   JWT_SECRET=$(openssl rand -base64 32)"
        echo "   CLIENT_URL=https://your-app.up.railway.app"
        echo ""
        echo "6. Add MongoDB service in Railway"
        echo "7. Deploy and visit your app!"
        echo ""
        echo "📋 After deployment, initialize database:"
        echo "   curl -X POST https://your-app.up.railway.app/api/setup/initialize"
        ;;
    2)
        echo ""
        echo "▲ Vercel Deployment (Frontend)"
        echo "=============================="
        echo "1. Build the frontend:"
        cd client && npm run build && cd ..
        echo "   ✅ Frontend built successfully"
        echo ""
        echo "2. Go to https://vercel.com"
        echo "3. Import your GitHub repository"
        echo "4. Set these build settings:"
        echo "   - Build Command: cd client && npm run build"
        echo "   - Output Directory: client/build"
        echo "5. Add environment variable:"
        echo "   - REACT_APP_API_URL=https://your-backend-url.com"
        echo ""
        echo "⚠️  Note: You'll need to deploy the backend separately (Railway recommended)"
        ;;
    3)
        echo ""
        echo "🟢 Netlify Deployment (Frontend)"
        echo "==============================="
        echo "1. Build the frontend:"
        cd client && npm run build && cd ..
        echo "   ✅ Frontend built successfully"
        echo ""
        echo "2. Go to https://netlify.com"
        echo "3. Drag and drop the 'client/build' folder"
        echo "4. Or connect your GitHub repository"
        echo "5. Create client/public/_redirects file:"
        echo "   /api/* https://your-backend.com/api/:splat 200"
        echo "   /* /index.html 200"
        echo ""
        echo "⚠️  Note: You'll need to deploy the backend separately"
        ;;
    4)
        echo ""
        echo "🟣 Heroku Deployment"
        echo "==================="
        echo "1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli"
        echo "2. Login to Heroku:"
        echo "   heroku login"
        echo "3. Create Heroku app:"
        echo "   heroku create kiur-hub-app"
        echo "4. Add MongoDB:"
        echo "   heroku addons:create mongolab:sandbox"
        echo "5. Set environment variables:"
        echo "   heroku config:set NODE_ENV=production"
        echo "   heroku config:set JWT_SECRET=$(openssl rand -base64 32)"
        echo "   heroku config:set CLIENT_URL=https://kiur-hub-app.herokuapp.com"
        echo "6. Deploy:"
        echo "   git push heroku main"
        ;;
    5)
        echo ""
        echo "📖 Manual Deployment Guide"
        echo "=========================="
        echo "Please check DEPLOYMENT.md for detailed instructions on:"
        echo "• Railway deployment"
        echo "• Vercel + Railway combo"
        echo "• Heroku deployment"
        echo "• DigitalOcean App Platform"
        echo "• Custom domain setup"
        echo "• Environment variables"
        echo "• Database configuration"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "🆘 Need help? Check the troubleshooting section in DEPLOYMENT.md"
echo ""
echo "🎉 Good luck with your deployment!"
echo "🇵🇭 Para sa bayan, para sa kinabukasan!"