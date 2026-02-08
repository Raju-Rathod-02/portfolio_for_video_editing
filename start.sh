#!/bin/bash

# Raju Portfolio - Quick Start Script for Mac/Linux

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║    🎬 RAJU VIDEO PORTFOLIO - QUICK START                ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "📥 Please install Node.js from: https://nodejs.org/"
    echo ""
    exit 1
fi

echo "✅ Node.js found:"
node --version
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm found:"
npm --version
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (this may take a minute)..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Start the server
echo "🚀 Starting Raju Portfolio Server..."
echo ""
echo "👉 Open your browser and go to: http://localhost:3000"
echo ""
echo "📊 Admin Panel: http://localhost:3000/admin"
echo "👤 Email: admin@raju.com"
echo "🔑 Password: admin123"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

npm start
