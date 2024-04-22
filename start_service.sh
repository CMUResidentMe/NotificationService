#!/bin/bash

# Define the service name
SERVICE_NAME="notification-service"

echo "Cleaning up dangling Docker images..."
# Remove dangling Docker images (unused images with no tag)
docker image prune -f

echo "Stopping existing $SERVICE_NAME if running..."
# Stop and remove any existing containers of the service
docker-compose down

echo "Starting $SERVICE_NAME..."
# Start the service using docker-compose
docker-compose up -d $SERVICE_NAME

echo "$SERVICE_NAME has been successfully started."
