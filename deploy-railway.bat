@echo off
echo 🚀 IntentLove Shop - Railway Deployment Script
echo ==============================================

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI is not installed. Please install it first:
    echo npm install -g @railway/cli
    pause
    exit /b 1
)

REM Check if user is logged in
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to Railway. Please login first:
    echo railway login
    pause
    exit /b 1
)

echo ✅ Railway CLI is ready

REM Function to deploy a service
:deploy_service
set service_name=%1
set service_path=%2
set service_port=%3

echo.
echo 📦 Deploying %service_name%...
echo Path: %service_path%
echo Port: %service_port%

cd /d "%service_path%"
if %errorlevel% neq 0 (
    echo ❌ Failed to change directory to %service_path%
    pause
    exit /b 1
)

REM Check if service is linked
if not exist ".railway" (
    echo 🔗 Linking service to Railway...
    railway link
)

REM Deploy the service
echo 🚀 Deploying to Railway...
railway up

if %errorlevel% equ 0 (
    echo ✅ %service_name% deployed successfully!
) else (
    echo ❌ Failed to deploy %service_name%
    pause
    exit /b 1
)

cd /d "%~dp0"
goto :eof

REM Main deployment process
echo.
echo 🎯 Starting deployment process...

REM Check deployment mode
if "%1"=="separate" (
    echo 📋 Deploying as separate services...
    
    REM Deploy Backend API
    call :deploy_service "Backend API" "creative-card-scribe-main\server" "3000"
    
    REM Deploy Main Frontend
    call :deploy_service "Main Frontend" "site frontend" "5173"
    
    REM Deploy Creative Card App
    call :deploy_service "Creative Card App" "creative-card-scribe-main\creative-card-scribe-main" "5174"
    
    REM Deploy Admin Dashboard
    call :deploy_service "Admin Dashboard" "site frontend\admin-dashboard" "5175"
) else (
    echo 📋 Deploying as monorepo (single service)...
    
    REM Build all frontend applications
    echo 🔨 Building frontend applications...
    npm run build
    
    if %errorlevel% neq 0 (
        echo ❌ Build failed
        pause
        exit /b 1
    )
    
    REM Deploy the entire application
    echo 🚀 Deploying to Railway...
    railway up
    
    if %errorlevel% equ 0 (
        echo ✅ Application deployed successfully!
    ) else (
        echo ❌ Deployment failed
        pause
        exit /b 1
    )
)

echo.
echo 🎉 Deployment completed!
echo.
echo 📊 Next steps:
echo 1. Set up environment variables in Railway dashboard
echo 2. Configure custom domains (optional)
echo 3. Set up monitoring and logging
echo 4. Test all endpoints
echo.
echo 🔗 Useful commands:
echo - View logs: railway logs
echo - Open dashboard: railway open
echo - Check status: railway status
echo.
pause
