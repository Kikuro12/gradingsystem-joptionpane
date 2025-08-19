#!/bin/bash

# Kiur Hub Startup Script
echo "🇵🇭 Starting Kiur Hub - Philippine Document Center"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null; then
    if ! pgrep -x "mongod" > /dev/null; then
        echo "⚠️  MongoDB doesn't seem to be running. Make sure MongoDB is started."
        echo "   You can start it with: sudo systemctl start mongod"
        echo "   Or using Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    fi
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cat > .env << EOL
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kiur-hub
JWT_SECRET=your-super-secret-jwt-key-change-in-production
WEATHER_API_KEY=your-weather-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
CLIENT_URL=http://localhost:3000
EOL
    echo "✅ Created .env file. Please update it with your configuration."
fi

# Create upload directories if they don't exist
mkdir -p server/uploads/documents server/uploads/images

echo ""
echo "🚀 Starting Kiur Hub..."
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Press Ctrl+C to stop"
echo ""

# Start both server and client in development mode
npm run dev