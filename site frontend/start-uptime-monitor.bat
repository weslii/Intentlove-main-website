@echo off
cd /d "%~dp0"
echo 🚀 Starting Supabase uptime monitor...
node uptime-monitor.js
pause
