#!/bin/bash

# Define the service name
SERVICE_NAME="notification-service"

echo "Cleaning up dangling Docker images..."
# Remove dangling Docker images (unused images with no tag)
docker image prune -f

echo "Rebuilding and starting $SERVICE_NAME..."
# Navigate to the directory containing the docker-compose.yml file if it's not in the current directory
# cd /path/to/your/project

# Rebuild the service
docker-compose build --no-cache $SERVICE_NAME

# Start the service
docker-compose up -d $SERVICE_NAME

echo "$SERVICE_NAME has been successfully started."
