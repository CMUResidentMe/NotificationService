import dotenv from 'dotenv';
dotenv.config();

import { Kafka } from 'kafkajs';
import kafkaConfig from '../../config/kafkaConfig.js';
import { socketManager } from '../middleware/socketManager.js'

const consumeWorkOrderEvents = async () => {
  const kafka = new Kafka(kafkaConfig);
  const consumer = kafka.consumer({ groupId: process.env.WORKORDER_TOPIC_GROUPID });
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.WORKORDER_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(topic);
      const eventData = JSON.parse(message.value.toString("UTF-8"));
      console.log(eventData);
      await socketManager.emitMessage(eventData['workOrder']['owner'], topic, eventData);
    },
  });
};

export { consumeWorkOrderEvents }
