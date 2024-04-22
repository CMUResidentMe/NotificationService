import dotenv from "dotenv";
dotenv.config();

import { Kafka } from "kafkajs";
import kafkaConfig from "../../config/kafkaConfig.js";
import { socketManager } from "../middleware/socketManager.js";

// General function to handle consumer setup
const setupConsumer = async (groupId, topic) => {
  const kafka = new Kafka(kafkaConfig);
  // Create a new consumer
  const consumer = kafka.consumer({ groupId });

  // Connect the consumer to the Kafka cluster
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  // Start consuming messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const eventData = JSON.parse(message.value.toString("UTF-8"));
      if (
        eventData.notificationType !== null &&
        eventData.notificationType !== undefined
      ) {
        socketManager.emitUserMessage(eventData.owner, eventData);
      } else {
        console.log(`Unsupported message format on topic ${topic}:`, eventData);
      }
    },
  });
};

// Function to initialize all consumers
const consumeEvents = async () => {
  // Setup consumer for Work Orders
  setupConsumer(
    process.env.WORKORDER_TOPIC_GROUPID,
    process.env.WORKORDER_TOPIC
  )
    .then(() => console.log("Work Order Consumer started successfully"))
    .catch((error) =>
      console.error("Failed to start Work Order Consumer:", error)
    );

  // Setup consumer for Communication Board
  setupConsumer(
    process.env.COMMBOARD_TOPIC_GROUPID,
    process.env.COMMBOARD_TOPIC
  )
    .then(() =>
      console.log("Communication Board Consumer started successfully")
    )
    .catch((error) =>
      console.error("Failed to start Communication Board Consumer:", error)
    );
};

export { consumeEvents };
