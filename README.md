# Notification Service

## Overview
This README provides instructions on how to set up and run the NotificationService using Docker. The NotificationService acts as a central hub for handling and dispatching notifications across different topics.

## Prerequisites
Before you begin, make sure you have Docker installed on your machine. If you do not have Docker installed, you can download and install it from [Docker's official website](https://www.docker.com/get-started).

## Getting Started


```
git clone [repository-url]
cd APIGateway
```
Replace `[repository-url]` with the actual URL of the repository.

### Step 2: Create an .env File
Before running the Docker container, create an `.env` file in the root directory of the project with the following configuration:

```
PORT=2008
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
KAFKA_BROKERS=host.docker.internal:29092
KAFKA_CLIENT_ID="notificationServer-1"
KAFKAJS_NO_PARTITIONER_WARNING=1
DEFAULT_TOPICS="work-order-events"
WORKORDER_TOPIC="work-order-events"
WORKORDER_TOPIC_GROUPID="work-order-service-1"
COMMBOARD_TOPIC="communication-board-events"
COMMBOARD_TOPIC_GROUPID="communication-board-service-1"
ROOMBOOK_TOPIC="roomBookingTopic"
ROOMBOOK_TOPIC_GROUPID="room-book-ID"
MARKET_PLACE_TOPIC="marketPlaceTopic"
MARKET_PLACE_TOPIC_GROUPID="marketPlaceTopic-1"
```
Replace `your_jwt_secret` with your JWT secret key, and customize each service URL and port according to your network setup.

### Step 3: Make the Script Executable
Before running the script, ensure it is executable. Run the following command in your terminal:

```
chmod +x ./rebuild_and_run.sh
```

### Step 4: Run the Script
Once the script is executable, you can run it to rebuild and start the Docker container:


```
./rebuild_and_run.sh
```

## What Does the Script Do?
The `rebuild_and_run.sh` script performs the following actions:
1. Builds a new Docker image from the Dockerfile.
2. Stops any previously running containers of the APIGateway.
3. Starts a new container using the newly built image.
