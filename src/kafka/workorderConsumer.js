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
      const eventData = JSON.parse(message.value.toString("UTF-8"));
      console.log(eventData);
      if('workOrder' in eventData){
        socketManager.emitUserMessage(eventData['workOrder']['owner'], eventData);
        if(eventData['workOrder']['assignedStaff'] != null && eventData['workOrder']['assignedStaff'] != undefined){
          socketManager.emitUserMessage(eventData['workOrder']['assignedStaff'], eventData);
        }
      }else{
        console.log("unsupport workoder message");
        console.log(eventData);
      }
    },
  });
};

export { consumeWorkOrderEvents }
