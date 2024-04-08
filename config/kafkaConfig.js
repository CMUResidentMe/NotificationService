import dotenv from 'dotenv';
dotenv.config();

const kafkaConfig = {
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKERS],
  };
  
export default kafkaConfig;
  