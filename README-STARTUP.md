# IntentLove Shop - Startup Guide

This guide will help you start all components of the IntentLove Shop application with a single command.

## 🚀 Quick Start

### Option 1: Using npm (Recommended)
```bash
# Install dependencies for all components
npm run install:all

# Start all services
npm run dev
# or simply
npm start
```

### Option 2: Using Windows Batch File
```cmd
# Double-click or run in Command Prompt
start-all.bat
```

### Option 3: Using Shell Script (Unix/Linux/macOS)
```bash
# Make executable and run
chmod +x start-all.sh
./start-all.sh
```

## 📋 What Gets Started

The startup scripts will launch four main components:

1. **Backend Server** (Port 3000)
   - Node.js/Express API server
   - Handles product data, orders, and business logic
   - Located in `creative-card-scribe-main/server/`

2. **Main Frontend** (Port 5173)
   - React e-commerce frontend
   - Customer-facing website
   - Located in `site frontend/`

3. **Creative Card Frontend** (Port 5174)
   - React creative card application
   - Card customization and creation interface
   - Located in `creative-card-scribe-main/card-tool/`

4. **Admin Dashboard** (Port 5175)
   - React admin interface
   - For managing products, orders, and users
   - Located in `site frontend/admin-dashboard/`

## 🔧 Available Commands

### Development
```bash
npm run dev              # Start all services in development mode
npm run dev:backend      # Start only backend server
npm run dev:frontend     # Start only main frontend
npm run dev:creative     # Start only creative card frontend
npm run dev:admin        # Start only admin dashboard
```

### Installation
```bash
npm run install:all      # Install dependencies for all components
npm run install:backend  # Install backend dependencies
npm run install:frontend # Install main frontend dependencies
npm run install:creative # Install creative card frontend dependencies
npm run install:admin    # Install admin dashboard dependencies
```

### Building
```bash
npm run build           # Build all components for production
npm run build:frontend  # Build main frontend
npm run build:creative  # Build creative card frontend
npm run build:admin     # Build admin dashboard
```

### Maintenance
```bash
npm run clean           # Clean all build artifacts and node_modules
npm run clean:node_modules  # Remove all node_modules folders
npm run clean:dist      # Remove all dist folders
npm run clean:build     # Remove all build folders
```

## 🌐 Access URLs

Once all services are running, you can access:

- **Main Website**: http://localhost:5173
- **Creative Card App**: http://localhost:5174
- **Admin Dashboard**: http://localhost:5175
- **Backend API**: http://localhost:3000

## ⚠️ Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Git (for cloning the repository)

## 🔍 Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
1. Check what's running on the port: `netstat -ano | findstr :PORT_NUMBER`
2. Stop the process using that port
3. Or change the port in the respective configuration files

### Dependencies Issues
If you encounter dependency issues:
```bash
# Clean and reinstall all dependencies
npm run clean
npm run install:all
```

### Permission Issues (Unix/Linux/macOS)
If the shell script doesn't run:
```bash
chmod +x start-all.sh
```

## 📝 Notes

- The backend server starts first to ensure the API is available
- Each service runs in its own terminal window (Windows) or background process (Unix)
- Use `Ctrl+C` to stop all services when using npm or shell script
- The batch file will keep windows open for debugging purposes

## 🆘 Support

If you encounter any issues:
1. Check the console output for error messages
2. Ensure all prerequisites are installed
3. Verify that no other services are using the required ports
4. Try running services individually to isolate issues
