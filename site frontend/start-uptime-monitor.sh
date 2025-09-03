#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting Supabase uptime monitor..."
node uptime-monitor.js
