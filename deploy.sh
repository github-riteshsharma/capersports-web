#!/bin/bash

# Azure App Service deployment script for CaperSports

echo "Starting deployment..."

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install --production

echo "Deployment complete!"
