#!/bin/bash
set -e

echo "🚀 Starting build process..."

# Ensure we're in the right directory
pwd
ls -la

echo "📦 Installing frontend dependencies..."
cd "site frontend"
pwd
ls -la

# Clear npm cache and ensure clean install
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --production=false
echo "✅ Frontend dependencies installed"

echo "🏗️ Building frontend..."
npm run build
echo "✅ Frontend built"

echo "📦 Installing creative tool dependencies..."
cd "../creative-card-scribe-main/creative-card-scribe-main"
pwd
ls -la

# Clear npm cache and ensure clean install
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --production=false
echo "✅ Creative tool dependencies installed"

echo "🏗️ Building creative tool..."
npm run build
echo "✅ Creative tool built"

echo "📦 Installing admin dashboard dependencies..."
cd "../../site frontend/admin-dashboard"
pwd
ls -la

# Clear npm cache and ensure clean install
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --production=false
echo "✅ Admin dashboard dependencies installed"

echo "🏗️ Building admin dashboard..."
npm run build
echo "✅ Admin dashboard built"

echo "🎉 All builds completed successfully!"
