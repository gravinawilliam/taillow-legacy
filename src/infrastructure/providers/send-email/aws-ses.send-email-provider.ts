import { SES } from 'aws-sdk';
import { createTransport, Transporter } from 'nodemailer';

import { ISendEmailProvider, SendEmailProviderDTO } from '@domain/contracts/providers/email/send.email-provider';
import { ProviderError } from '@domain/entities/errors/shared/provider.error';

import { failure, success } from '@shared/utils/either.util';

export class AwsSesSendEmailProvider implements ISendEmailProvider {
  private client: Transporter;

  constructor(
    private readonly environments: {
      aws: {
        ses: {
          region: string;
          credentials: {
            accessKeyId: string;
            secretAccessKey: string;
          };
        };
      };
    }
  ) {
    this.client = createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: this.environments.aws.ses.region,
        credentials: {
          accessKeyId: this.environments.aws.ses.credentials.accessKeyId,
          secretAccessKey: this.environments.aws.ses.credentials.secretAccessKey
        }
      })
    });
  }

  public async send(parameters: SendEmailProviderDTO.Parameters): SendEmailProviderDTO.Result {
    try {
      const resultSendEmail = await this.client.sendMail({
        from: {
          name: parameters.from.name,
          address: parameters.from.email.value
        },
        to: {
          name: parameters.to.name,
          address: parameters.to.email.value
        },
        subject: parameters.subject,
        html: parameters.html
      });

      console.log(resultSendEmail);

      return success(undefined);
    } catch (error: any) {
      console.log(error);
      return failure(
        new ProviderError({
          method: 'send',
          provider: 'aws-ses',
          error
        })
      );
    }
  }
}
