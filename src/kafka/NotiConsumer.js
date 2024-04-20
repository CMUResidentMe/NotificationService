import dotenv from 'dotenv';
dotenv.config();

import { Kafka } from 'kafkajs';
import kafkaConfig from '../../config/kafkaConfig.js';
import { socketManager } from '../middleware/socketManager.js'

const consumeEvents = async () => {
  const kafka = new Kafka(kafkaConfig);
  const consumer = kafka.consumer({ groupId: process.env.WORKORDER_TOPIC_GROUPID });
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.WORKORDER_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const eventData = JSON.parse(message.value.toString("UTF-8"));
      // console.log(eventData);
                /*
	  private String notificationType;
 private String eventTime;
    private String owner;
    private String message;
    private String sourceID;
            */
           /*
           {"notificationType":"workorderChanged","eventTime":"04-21 05:56",
           "owner":"661c076da8293a3ed2fd06f4",
           "message":"semanticId:WO-67, status change to OPEN, 661c076da8293a3ed2fd06f4 will not take this ticket.",
           "sourceID":"66231bdb9577c033f0c1c575"}
           */
      if (eventData.notificationType !== null && eventData.notificationType !== undefined) {
        socketManager.emitUserMessage(eventData.owner, eventData);
      } else {
        console.log("unsupport message");
        console.log(eventData);
      }
    },
  });
};

export { consumeEvents }
