import { Kafka } from 'kafkajs';

import { KAFKA_CONFIG } from './environments.config';

export const kafka = new Kafka({
  clientId: KAFKA_CONFIG.CLIENT_ID,
  brokers: [KAFKA_CONFIG.BROKER]
});
