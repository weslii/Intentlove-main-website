#!/bin/bash

echo "========================================"
echo "   IntentLove Shop - Starting All Services"
echo "========================================"
echo

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $1 is already in use. Please stop the service using that port first."
        exit 1
    fi
}

# Check if ports are available
echo "Checking port availability..."
check_port 3000
check_port 5176
check_port 5174
check_port 5175

echo "Starting Backend Server..."
cd creative-card-scribe-main/server
npm run dev &
BACKEND_PID=$!
cd ../..

echo "Waiting 3 seconds for backend to initialize..."
sleep 3

echo "Starting Main Frontend..."
cd "site frontend"
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Waiting 2 seconds for main frontend to initialize..."
sleep 2

echo "Starting Creative Card Frontend..."
cd "creative-card-scribe-main/card-tool"
npm run dev &
CREATIVE_PID=$!
cd ../..

echo "Waiting 2 seconds for creative card frontend to initialize..."
sleep 2

echo "Starting Admin Dashboard..."
cd "site frontend/admin-dashboard"
npm run dev &
ADMIN_PID=$!
cd ../..

echo
echo "========================================"
echo "   All services are starting..."
echo "========================================"
echo
echo "Services:"
echo "- Backend Server: http://localhost:3000 (PID: $BACKEND_PID)"
echo "- Main Frontend: http://localhost:5176 (PID: $FRONTEND_PID)"
echo "- Creative Card Frontend: http://localhost:5174 (PID: $CREATIVE_PID)"
echo "- Admin Dashboard: http://localhost:5175 (PID: $ADMIN_PID)"
echo
echo "Press Ctrl+C to stop all services..."

# Function to cleanup on exit
cleanup() {
    echo
    echo "Stopping all services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    kill $CREATIVE_PID 2>/dev/null
    kill $ADMIN_PID 2>/dev/null
    echo "All services stopped."
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait
