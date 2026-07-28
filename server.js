const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// MongoDB connection
const connectDB = require('./config/db');
const WhitelistedIP = require('./models/WhitelistedIP');

const app = express();
const PORT = process.env.PORT || 5000;

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

async function autoWhitelistLocalIP() {
  try {
    const ip = getLocalIP();
    if (!ip) {
      console.log('Could not detect local IP address.');
      return;
    }
    const exists = await WhitelistedIP.findOne({ ip });
    if (!exists) {
      await WhitelistedIP.create({ ip, label: 'Server startup', addedBy: 'server-startup' });
      console.log(`IP auto-whitelisted on startup: ${ip}`);
    } else {
      console.log(`IP already whitelisted: ${ip}`);
    }
  } catch (err) {
    console.error('Startup auto-whitelist error:', err.message);
  }
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

app.use('/api', require('./routes/contact'));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/admin'));

// Connect to MongoDB before starting server
connectDB().then(() => {
  autoWhitelistLocalIP();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
