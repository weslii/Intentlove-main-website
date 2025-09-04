#!/bin/bash
set -e

echo "🚀 Starting build process..."

echo "📦 Installing frontend dependencies..."
cd "site frontend"
npm install
echo "✅ Frontend dependencies installed"

echo "🏗️ Building frontend..."
npm run build
echo "✅ Frontend built"

echo "📦 Installing creative tool dependencies..."
cd "../creative-card-scribe-main/creative-card-scribe-main"
npm install
echo "✅ Creative tool dependencies installed"

echo "🏗️ Building creative tool..."
npm run build
echo "✅ Creative tool built"

echo "📦 Installing admin dashboard dependencies..."
cd "../../site frontend/admin-dashboard"
npm install
echo "✅ Admin dashboard dependencies installed"

echo "🏗️ Building admin dashboard..."
npm run build
echo "✅ Admin dashboard built"

echo "🎉 All builds completed successfully!"
