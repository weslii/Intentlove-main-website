#!/bin/bash

echo "🚀 IntentLove Shop - Railway Deployment Script"
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Please login first:"
    echo "railway login"
    exit 1
fi

echo "✅ Railway CLI is ready"

# Function to deploy a service
deploy_service() {
    local service_name=$1
    local service_path=$2
    local service_port=$3
    
    echo ""
    echo "📦 Deploying $service_name..."
    echo "Path: $service_path"
    echo "Port: $service_port"
    
    cd "$service_path" || exit 1
    
    # Check if service is linked
    if [ ! -f ".railway" ]; then
        echo "🔗 Linking service to Railway..."
        railway link
    fi
    
    # Deploy the service
    echo "🚀 Deploying to Railway..."
    railway up
    
    if [ $? -eq 0 ]; then
        echo "✅ $service_name deployed successfully!"
    else
        echo "❌ Failed to deploy $service_name"
        exit 1
    fi
    
    cd - > /dev/null || exit 1
}

# Main deployment process
echo ""
echo "🎯 Starting deployment process..."

# Option 1: Deploy as separate services (recommended for production)
if [ "$1" = "separate" ]; then
    echo "📋 Deploying as separate services..."
    
    # Deploy Backend API
    deploy_service "Backend API" "creative-card-scribe-main/server" "3000"
    
    # Deploy Main Frontend
    deploy_service "Main Frontend" "site frontend" "5173"
    
    # Deploy Creative Card App
    deploy_service "Creative Card App" "creative-card-scribe-main/card-tool" "5174"
    
    # Deploy Admin Dashboard
    deploy_service "Admin Dashboard" "site frontend/admin-dashboard" "5175"

# Option 2: Deploy as monorepo (single service)
else
    echo "📋 Deploying as monorepo (single service)..."
    
    # Build all frontend applications
    echo "🔨 Building frontend applications..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed"
        exit 1
    fi
    
    # Deploy the entire application
    echo "🚀 Deploying to Railway..."
    railway up
    
    if [ $? -eq 0 ]; then
        echo "✅ Application deployed successfully!"
    else
        echo "❌ Deployment failed"
        exit 1
    fi
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📊 Next steps:"
echo "1. Set up environment variables in Railway dashboard"
echo "2. Configure custom domains (optional)"
echo "3. Set up monitoring and logging"
echo "4. Test all endpoints"
echo ""
echo "🔗 Useful commands:"
echo "- View logs: railway logs"
echo "- Open dashboard: railway open"
echo "- Check status: railway status"
