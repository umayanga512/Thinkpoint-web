#!/bin/bash

# This script helps set up environment variables for Strapi CMS integration

# Default values
DEFAULT_STRAPI_URL="http://localhost:1337"

# Prompt for Strapi URL
read -p "Enter your Strapi API URL [$DEFAULT_STRAPI_URL]: " STRAPI_URL
STRAPI_URL=${STRAPI_URL:-$DEFAULT_STRAPI_URL}

# Prompt for Strapi API token
read -p "Enter your Strapi API token: " STRAPI_TOKEN

# Check if .env file exists
if [ -f .env ]; then
  # Backup existing .env file
  cp .env .env.backup
  echo "Backed up existing .env file to .env.backup"
  
  # Check if variables already exist in .env and update them
  if grep -q "STRAPI_API_URL" .env; then
    sed -i "s|STRAPI_API_URL=.*|STRAPI_API_URL=$STRAPI_URL|g" .env
  else
    echo "STRAPI_API_URL=$STRAPI_URL" >> .env
  fi
  
  if grep -q "STRAPI_API_TOKEN" .env; then
    sed -i "s|STRAPI_API_TOKEN=.*|STRAPI_API_TOKEN=$STRAPI_TOKEN|g" .env
  else
    echo "STRAPI_API_TOKEN=$STRAPI_TOKEN" >> .env
  fi
else
  # Create new .env file
  echo "STRAPI_API_URL=$STRAPI_URL" > .env
  echo "STRAPI_API_TOKEN=$STRAPI_TOKEN" >> .env
fi

echo ""
echo "Environment variables have been set up successfully!"
echo "You can now build your Astro site with Strapi CMS integration."
echo ""
echo "To test the connection, run:"
echo "  bun run dev"
echo ""
echo "For more information, see the documentation in docs/seo-integration.md" 