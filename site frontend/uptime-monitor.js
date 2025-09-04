const https = require('https');

// Your Supabase project URL
const SUPABASE_URL = 'https://htnxqfnzirxxvuepdaof.supabase.co';

// Function to ping Supabase
function pingSupabase() {
  return new Promise((resolve, reject) => {
    const req = https.get(SUPABASE_URL, (res) => {
      console.log(`✅ Ping successful - Status: ${res.statusCode} - ${new Date().toISOString()}`);
      resolve();
    });

    req.on('error', (err) => {
      console.error(`❌ Ping failed: ${err.message} - ${new Date().toISOString()}`);
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Ping every 6 hours (4 times per day)
const PING_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

async function startMonitoring() {
  console.log('🚀 Starting Supabase uptime monitor...');
  console.log(`📡 Will ping ${SUPABASE_URL} every 6 hours`);
  
  // Initial ping
  try {
    await pingSupabase();
  } catch (error) {
    console.error('Initial ping failed:', error.message);
  }

  // Set up recurring pings
  setInterval(async () => {
    try {
      await pingSupabase();
    } catch (error) {
      console.error('Recurring ping failed:', error.message);
    }
  }, PING_INTERVAL);
}

// Start the monitor
startMonitoring();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping uptime monitor...');
  process.exit(0);
});



