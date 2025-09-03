# IntentLove Shop - Microservices Deployment Checklist

## ✅ Pre-Deployment Checklist

### **1. Railway CLI Setup**
- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Login to Railway: `railway login`
- [ ] Verify login: `railway whoami`

### **2. Environment Preparation**
- [ ] Review all environment variable examples
- [ ] Prepare secure JWT secret
- [ ] Gather API keys (Google, OpenAI, etc.)
- [ ] Plan custom domain strategy (optional)

### **3. Code Review**
- [ ] All services have proper `railway.json` files
- [ ] All services have `serve` scripts for production
- [ ] Backend CORS is configured for multiple origins
- [ ] Environment variables are properly referenced

## 🚀 Deployment Steps

### **Step 1: Deploy Creative Card Server**
```bash
cd creative-card-scribe-main/server
railway link
railway up
```
- [ ] Service deployed successfully
- [ ] Note the generated URL
- [ ] Test health endpoint: `https://your-creative-card-server.railway.app/api/health`

### **Step 2: Deploy Main Frontend**
```bash
cd site frontend
railway link
railway up
```
- [ ] Service deployed successfully
- [ ] Note the generated URL
- [ ] Test the application loads

### **Step 3: Deploy Creative Card App**
```bash
cd creative-card-scribe-main/creative-card-scribe-main
railway link
railway up
```
- [ ] Service deployed successfully
- [ ] Note the generated URL
- [ ] Test the application loads

### **Step 4: Deploy Admin Dashboard**
```bash
cd site frontend/admin-dashboard
railway link
railway up
```
- [ ] Service deployed successfully
- [ ] Note the generated URL
- [ ] Test the application loads

## 🔧 Environment Variables Configuration

### **Creative Card Server Variables**
Set in Railway dashboard for Creative Card Server service:
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`
- [ ] `CREATIVE_APP_URL=https://your-creative-app.railway.app`
- [ ] `JWT_SECRET=your_secure_secret`
- [ ] `CORS_ORIGIN=https://your-creative-app.railway.app`

### **Main Frontend Variables**
Set in Railway dashboard for Main Frontend service:
- [ ] `VITE_APP_ENV=production`
- [ ] `VITE_SUPABASE_URL=https://htnxqfnzirxxvuepdaof.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bnhxZm56aXJ4eHZ1ZXBkYW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjQ5ODIsImV4cCI6MjA2ODUwMDk4Mn0.kImw6EMpRm2AXnyzbi4usJCO3zolrJRpvW9g5JMrZJY`
- [ ] `VITE_CREATIVE_APP_URL=https://your-creative-app.railway.app`
- [ ] `VITE_ADMIN_APP_URL=https://your-admin-dashboard.railway.app`

### **Creative Card App Variables**
Set in Railway dashboard for Creative Card App service:
- [ ] `VITE_API_BASE_URL=https://your-creative-card-server.railway.app`
- [ ] `VITE_APP_ENV=production`
- [ ] `VITE_MAIN_APP_URL=https://your-main-frontend.railway.app`
- [ ] `VITE_ADMIN_APP_URL=https://your-admin-dashboard.railway.app`

### **Admin Dashboard Variables**
Set in Railway dashboard for Admin Dashboard service:
- [ ] `VITE_APP_ENV=production`
- [ ] `VITE_SUPABASE_URL=https://htnxqfnzirxxvuepdaof.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bnhxZm56aXJ4eHZ1ZXBkYW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjQ5ODIsImV4cCI6MjA2ODUwMDk4Mn0.kImw6EMpRm2AXnyzbi4usJCO3zolrJRpvW9g5JMrZJY`
- [ ] `VITE_MAIN_APP_URL=https://your-main-frontend.railway.app`
- [ ] `VITE_CREATIVE_APP_URL=https://your-creative-app.railway.app`

## 🧪 Testing Checklist

### **Individual Service Tests**
- [ ] Creative Card Server health check: `/api/health`
- [ ] Main Frontend loads without errors
- [ ] Creative Card App loads without errors
- [ ] Admin Dashboard loads without errors

### **Cross-Service Communication Tests**
- [ ] Creative Card App can communicate with Creative Card Server
- [ ] Main Frontend can access Supabase data
- [ ] Admin Dashboard can access Supabase data
- [ ] Cross-service navigation works (if implemented)

### **Functionality Tests**
- [ ] API endpoints respond correctly
- [ ] File uploads work
- [ ] Card generation works
- [ ] OCR functionality works
- [ ] Admin features work

## 📊 Monitoring Setup

### **Railway Dashboard**
- [ ] Monitor each service's logs
- [ ] Check resource usage
- [ ] Set up alerts for failures
- [ ] Monitor response times

### **Health Checks**
- [ ] Creative Card Server: `https://your-creative-card-server.railway.app/api/health`
- [ ] Frontend Services: Check Railway dashboard for uptime

## 🔒 Security Checklist

### **Environment Variables**
- [ ] All sensitive data is in environment variables
- [ ] JWT secret is secure and unique
- [ ] API keys are properly configured
- [ ] CORS origins are correctly set

### **Access Control**
- [ ] Admin dashboard is properly secured
- [ ] API endpoints have appropriate rate limiting
- [ ] File uploads are properly validated

## 🚀 Post-Deployment

### **Documentation**
- [ ] Update deployment documentation with actual URLs
- [ ] Document any custom configurations
- [ ] Create runbook for common issues

### **Monitoring**
- [ ] Set up regular health checks
- [ ] Monitor performance metrics
- [ ] Set up error alerting

### **Scaling**
- [ ] Configure auto-scaling rules
- [ ] Set up resource limits
- [ ] Monitor cost usage

## 🆘 Troubleshooting

### **Common Issues**
- [ ] CORS errors - Check environment variables
- [ ] Build failures - Check Railway logs
- [ ] Service communication - Verify URLs
- [ ] Performance issues - Monitor resources

### **Useful Commands**
```bash
# Check service status
railway status

# View logs
railway logs

# Open dashboard
railway open

# Redeploy service
railway up
```

## ✅ Final Verification

- [ ] All services are running
- [ ] All environment variables are set
- [ ] All functionality works as expected
- [ ] Monitoring is set up
- [ ] Documentation is updated
- [ ] Team is notified of deployment

**🎉 Deployment Complete!**
