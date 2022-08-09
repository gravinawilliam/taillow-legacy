import { Consumer, ConsumerSubscribeTopics, EachMessagePayload } from 'kafkajs';

import { KAFKA_CONFIG } from '@main/configs/environments.config';
import { kafka } from '@main/configs/kafka.config';
import { makeSendEmailController } from '@main/factories/controllers/emails/send-email/send-email-controller.factory';

export const sendEmailQueue = async (): Promise<void> => {
  const kafkaConsumer: Consumer = kafka.consumer({ groupId: 'request-to-send-email-id' });

  const topic: ConsumerSubscribeTopics = {
    fromBeginning: false,
    topics: [KAFKA_CONFIG.TOPIC_REQUEST_TO_SEND_EMAIL]
  };

  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe(topic);
  await kafkaConsumer.run({
    eachMessage: async (parameters: EachMessagePayload) => {
      const parseMessage = JSON.parse(`${parameters.message.value}`);
      const controller = makeSendEmailController();
      await controller.handle({
        requester: {
          apiKey: parseMessage.apiKey
        },
        emailData: {
          emailTemplate: {
            id: parseMessage.emailTemplate.id,
            variables: parseMessage.emailTemplate.variables
          },
          to: {
            email: parseMessage.to.email,
            name: parseMessage.to.name
          }
        }
      });
    }
  });
};
