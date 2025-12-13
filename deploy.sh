#!/bin/bash
set -e

SERVER_IP="62.171.164.53"
SERVER_USER="root"
SERVER_PASS='704741982Moha@#'

echo "🚀 Deploying to Contabo Server..."

# Create deployment directory on server
export SSHPASS="$SERVER_PASS"
sshpass -e ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
echo "📦 Setting up server..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Check PM2
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Create directory
mkdir -p ~/flutterzon/server
cd ~/flutterzon

echo "✅ Server setup complete!"
node --version
pm2 --version
ENDSSH

echo "📤 Uploading files..."
# Upload server files
sshpass -e scp -o StrictHostKeyChecking=no -r /workspaces/flutterzon_bloc/server/* $SERVER_USER@$SERVER_IP:~/flutterzon/server/
sshpass -e scp -o StrictHostKeyChecking=no /workspaces/flutterzon_bloc/config.env $SERVER_USER@$SERVER_IP:~/flutterzon/

echo "🔧 Installing dependencies and starting server..."
sshpass -e ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd ~/flutterzon/server
npm install

# Stop existing process if running
pm2 delete flutterzon-server 2>/dev/null || true

# Start server
pm2 start index.js --name flutterzon-server
pm2 save
pm2 startup systemd -u root --hp /root

# Show status
pm2 status
ENDSSH

echo "✅ Deployment complete!"
echo "🌐 Server running at: http://62.171.164.53:3000"
