@echo off
echo 🚀 Installing Supabase uptime monitor as Windows startup service...

REM Get the current directory
set "SCRIPT_DIR=%~dp0"
set "MONITOR_PATH=%SCRIPT_DIR%start-uptime-monitor.bat"

REM Create a scheduled task that runs on startup
schtasks /create /tn "Supabase Uptime Monitor" /tr "%MONITOR_PATH%" /sc onstart /ru "%USERNAME%" /f

if %ERRORLEVEL% EQU 0 (
    echo ✅ Successfully installed uptime monitor as startup service!
    echo 📋 You can manage it in Task Scheduler or run: schtasks /query /tn "Supabase Uptime Monitor"
) else (
    echo ❌ Failed to install startup service. Try running as Administrator.
)

pause
