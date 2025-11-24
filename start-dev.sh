#!/bin/bash

# Script to start both API server and Vite dev server
# Usage: ./start-dev.sh

echo "🚀 Starting development servers..."
echo ""

# Start API server in background
echo "📡 Starting API server on port 3001..."
node api-server.js &
API_PID=$!

# Wait a moment for API server to start
sleep 2

# Start Vite dev server
echo "⚡ Starting Vite dev server on port 8080..."
npm run dev

# When Vite stops, kill the API server
kill $API_PID 2>/dev/null
echo ""
echo "✅ Development servers stopped."

