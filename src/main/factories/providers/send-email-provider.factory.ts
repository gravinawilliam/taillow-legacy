import { ISendEmailProvider } from '@domain/contracts/providers/email/send.email-provider';

import { AwsSesSendEmailProvider } from '@infrastructure/providers/send-email/aws-ses.send-email-provider';

import { AWS_CONFIG } from '@main/configs/environments.config';

export const makeSendEmailProvider = (): ISendEmailProvider => {
  return new AwsSesSendEmailProvider({
    aws: {
      ses: {
        credentials: {
          accessKeyId: AWS_CONFIG.SES.ACCESS_KEY_ID,
          secretAccessKey: AWS_CONFIG.SES.SECRET_ACCESS_KEY
        },
        region: AWS_CONFIG.SES.REGION
      }
    }
  });
};
