# IntentLove Shop - Railway Deployment Guide

## 🚀 Recommended Architecture

For Railway production deployment, we'll use a **microservices approach** with separate services that can scale independently:

### **Service Structure:**
1. **Backend API** - Node.js/Express server
2. **Main Frontend** - React e-commerce site
3. **Creative Card App** - React card creation tool
4. **Admin Dashboard** - React admin interface

## 📋 Deployment Strategy

### **Option 1: Separate Services (Recommended)**
Deploy each component as a separate Railway service for maximum scalability and flexibility.

### **Option 2: Monorepo with Build Scripts**
Deploy as a single service with build scripts for all frontends.

## 🔧 Implementation Plan

### **Step 1: Environment Configuration**

Create environment variables for each service:

```bash
# Backend API
RAILWAY_API_URL=https://your-backend-api.railway.app
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

# Frontend Apps
VITE_API_BASE_URL=https://your-backend-api.railway.app
VITE_APP_ENV=production
```

### **Step 2: Railway Configuration Files**

Each service needs its own `railway.json` and deployment configuration.

### **Step 3: Build Optimization**

Optimize builds for production with proper caching and asset optimization.

## 🛠️ Quick Start Commands

### **Option 1: Automated Deployment (Recommended)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy everything at once
./deploy-railway.sh          # Unix/Linux/macOS
deploy-railway.bat           # Windows

# Or deploy as separate services
./deploy-railway.sh separate # Unix/Linux/macOS
deploy-railway.bat separate  # Windows
```

### **Option 2: Manual Deployment**

```bash
# Deploy Backend API
cd creative-card-scribe-main/server
railway link
railway up

# Deploy Main Frontend
cd site frontend
railway link
railway up

# Deploy Creative Card App
cd creative-card-scribe-main/card-tool
railway link
railway up

# Deploy Admin Dashboard
cd site frontend/admin-dashboard
railway link
railway up
```

### **Option 3: Monorepo Deployment**

```bash
# Deploy everything as a single service
npm run build
railway up
```

## 📊 Benefits of This Approach

- **Independent Scaling**: Each service can scale based on demand
- **Fault Isolation**: One service failure doesn't affect others
- **Technology Flexibility**: Can use different tech stacks per service
- **Cost Optimization**: Pay only for what you use
- **Easy Maintenance**: Update services independently
- **Future-Proof**: Easy to add new services or modify existing ones
- **Performance**: Each service can be optimized independently

## 🌐 Production URLs

After deployment, your services will be available at:

- **Main Website**: `https://your-app-name.railway.app`
- **Creative Card App**: `https://your-app-name.railway.app/creative`
- **Admin Dashboard**: `https://your-app-name.railway.app/admin`
- **API Endpoints**: `https://your-app-name.railway.app/api/*`

## 🔧 Environment Variables

Set these in your Railway dashboard:

```bash
NODE_ENV=production
PORT=5000
RAILWAY_API_URL=https://your-app-name.railway.app
JWT_SECRET=your_super_secure_jwt_secret
CORS_ORIGIN=https://your-app-name.railway.app
```

## 📈 Monitoring & Scaling

- **Auto-scaling**: Railway automatically scales based on traffic
- **Health checks**: Built-in health monitoring at `/api/health`
- **Logs**: Access logs via Railway dashboard or CLI
- **Metrics**: Monitor performance in Railway dashboard
