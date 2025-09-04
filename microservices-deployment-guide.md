# IntentLove Shop - Microservices Deployment Guide

## 🚀 Microservices Architecture

This guide will help you deploy each component of IntentLove Shop as separate, independently scalable services on Railway.

### **Service Structure:**
1. **Creative Card Server** - Node.js/Express server for card creation tool (Port 3000)
2. **Main Frontend** - React e-commerce site (Port 8080) - Uses Supabase directly
3. **Creative Card App** - React card creation tool (Port 5174) - Connects to Creative Card Server
4. **Admin Dashboard** - React admin interface (Port 5175) - Uses Supabase directly

## 📋 Deployment Strategy

Each service will be deployed independently, allowing for:
- **Independent scaling** based on demand
- **Fault isolation** - one service failure doesn't affect others
- **Technology flexibility** - can use different tech stacks per service
- **Cost optimization** - pay only for what you use
- **Easy maintenance** - update services independently

## 🛠️ Quick Start

### **Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

### **Step 2: Login to Railway**
```bash
railway login
```

### **Step 3: Deploy All Services**
```bash
# Windows
deploy-railway.bat separate

# Unix/Linux/macOS
chmod +x deploy-railway.sh
./deploy-railway.sh separate
```

## 🔧 Individual Service Deployment

### **Creative Card Server**
```bash
cd creative-card-scribe-main/server
railway link
railway up
```

### **Main Frontend**
```bash
cd site frontend
railway link
railway up
```

### **Creative Card App**
```bash
cd creative-card-scribe-main/card-tool
railway link
railway up
```

### **Admin Dashboard**
```bash
cd site frontend/admin-dashboard
railway link
railway up
```

## 🌐 Production URLs

After deployment, each service will have its own URL:

- **Creative Card Server**: `https://your-creative-card-server.railway.app`
- **Main Frontend**: `https://your-main-frontend.railway.app`
- **Creative Card App**: `https://your-creative-app.railway.app`
- **Admin Dashboard**: `https://your-admin-dashboard.railway.app`

## 🔧 Environment Variables

### **Creative Card Server Environment Variables**
Set these in the Creative Card Server service dashboard:
```bash
NODE_ENV=production
PORT=3000
CREATIVE_APP_URL=https://your-creative-app.railway.app
JWT_SECRET=your_super_secure_jwt_secret
CORS_ORIGIN=https://your-creative-app.railway.app
```

### **Main Frontend Environment Variables**
Set these in the Main Frontend service dashboard:
```bash
VITE_APP_ENV=production
VITE_SUPABASE_URL=https://htnxqfnzirxxvuepdaof.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bnhxZm56aXJ4eHZ1ZXBkYW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjQ5ODIsImV4cCI6MjA2ODUwMDk4Mn0.kImw6EMpRm2AXnyzbi4usJCO3zolrJRpvW9g5JMrZJY
VITE_CREATIVE_APP_URL=https://your-creative-app.railway.app
VITE_ADMIN_APP_URL=https://your-admin-dashboard.railway.app
```

### **Creative Card App Environment Variables**
Set these in the Creative Card App service dashboard:
```bash
VITE_API_BASE_URL=https://your-creative-card-server.railway.app
VITE_APP_ENV=production
VITE_MAIN_APP_URL=https://your-main-frontend.railway.app
VITE_ADMIN_APP_URL=https://your-admin-dashboard.railway.app
```

### **Admin Dashboard Environment Variables**
Set these in the Admin Dashboard service dashboard:
```bash
VITE_APP_ENV=production
VITE_SUPABASE_URL=https://htnxqfnzirxxvuepdaof.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bnhxZm56aXJ4eHZ1ZXBkYW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjQ5ODIsImV4cCI6MjA2ODUwMDk4Mn0.kImw6EMpRm2AXnyzbi4usJCO3zolrJRpvW9g5JMrZJY
VITE_MAIN_APP_URL=https://your-main-frontend.railway.app
VITE_CREATIVE_APP_URL=https://your-creative-app.railway.app
```

## 📊 Service Communication

### **Service Communication**
- **Creative Card App** communicates with **Creative Card Server**:
  - **Generate**: `https://your-creative-card-server.railway.app/api/generate`
  - **OCR**: `https://your-creative-card-server.railway.app/api/ocr`
  - **Track**: `https://your-creative-card-server.railway.app/api/track`
  - **Upload**: `https://your-creative-card-server.railway.app/api/upload`
  - **Health**: `https://your-creative-card-server.railway.app/api/health`

- **Main Frontend** and **Admin Dashboard** use **Supabase** directly for:
  - Products, Orders, Customers, Analytics

### **Cross-Service Navigation**
Each service can link to others:
- Main Frontend → Creative Card App
- Main Frontend → Admin Dashboard
- Creative Card App → Main Frontend
- Creative Card App → Admin Dashboard
- Admin Dashboard → Main Frontend
- Admin Dashboard → Creative Card App

## 🔍 Monitoring & Scaling

### **Individual Service Monitoring**
- Each service has its own logs and metrics
- Monitor performance independently
- Set up alerts for each service

### **Scaling Strategy**
- **Creative Card Server**: Scale based on card creation activity
- **Main Frontend**: Scale based on user traffic
- **Creative Card App**: Scale based on card creation activity
- **Admin Dashboard**: Scale based on admin usage

### **Health Checks**
- **Creative Card Server**: `/api/health`
- **Frontend Services**: `/` (root path)

## 🚀 Advanced Features

### **Custom Domains**
Set up custom domains for each service:
- `shop.intentlove.com` → Main Frontend
- `creative.intentlove.com` → Creative Card App
- `admin.intentlove.com` → Admin Dashboard
- `api.intentlove.com` → Creative Card Server

### **Load Balancing**
Railway automatically handles load balancing for each service.

### **Auto-scaling**
Each service can be configured to auto-scale based on:
- CPU usage
- Memory usage
- Request volume
- Custom metrics

## 🔧 Troubleshooting

### **Service Communication Issues**
1. Check CORS configuration in Backend API
2. Verify environment variables are set correctly
3. Ensure all service URLs are accessible

### **Deployment Issues**
1. Check Railway logs for each service
2. Verify build commands are correct
3. Ensure all dependencies are installed

### **Performance Issues**
1. Monitor individual service metrics
2. Scale services based on usage patterns
3. Optimize database queries and API calls

## 📈 Benefits of Microservices

- **Scalability**: Scale each service independently
- **Reliability**: Fault isolation prevents cascading failures
- **Maintainability**: Update services without affecting others
- **Technology Diversity**: Use different tech stacks per service
- **Team Autonomy**: Different teams can work on different services
- **Cost Optimization**: Pay only for what you use
- **Future-Proof**: Easy to add new services or modify existing ones

## 🎯 Next Steps

1. **Deploy all services** using the deployment scripts
2. **Configure environment variables** for each service
3. **Set up monitoring** and alerts
4. **Test cross-service communication**
5. **Configure custom domains** (optional)
6. **Set up CI/CD pipelines** for automated deployments
