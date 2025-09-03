#!/bin/bash
echo "🚀 Installing Supabase uptime monitor as Linux systemd service..."

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONITOR_PATH="$SCRIPT_DIR/uptime-monitor.js"

# Create systemd service file
sudo tee /etc/systemd/system/supabase-uptime-monitor.service > /dev/null << EOF
[Unit]
Description=Supabase Uptime Monitor
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$SCRIPT_DIR
ExecStart=/usr/bin/node $MONITOR_PATH
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable the service
sudo systemctl daemon-reload
sudo systemctl enable supabase-uptime-monitor.service

echo "✅ Service installed! Starting now..."
sudo systemctl start supabase-uptime-monitor.service

echo "📋 Service status:"
sudo systemctl status supabase-uptime-monitor.service

echo "🔧 To manage the service:"
echo "   Start: sudo systemctl start supabase-uptime-monitor"
echo "   Stop:  sudo systemctl stop supabase-uptime-monitor"
echo "   Status: sudo systemctl status supabase-uptime-monitor"
echo "   Logs:  sudo journalctl -u supabase-uptime-monitor -f"
