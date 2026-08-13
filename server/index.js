import os from 'node:os';
import app from './app.js';

const PORT = Number(process.env.PORT || 5000);
const HOST = '0.0.0.0';

function getLanAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        addresses.push(entry.address);
      }
    }
  }

  return [...new Set(addresses)];
}

app.listen(PORT, HOST, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Local:   http://localhost:${PORT}/api/health`);

  const lanAddresses = getLanAddresses();
  if (lanAddresses.length === 0) {
    console.log('Network: no LAN IPv4 address detected');
  } else {
    for (const address of lanAddresses) {
      console.log(`Network: http://${address}:${PORT}/api/health`);
    }
  }
});
