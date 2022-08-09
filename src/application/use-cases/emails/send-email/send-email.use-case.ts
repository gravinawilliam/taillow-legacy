import { IAddVariablesInEmailTemplateProvider } from '@domain/contracts/providers/email-template/add-variables-in-email-template.provider';
import { ISendEmailProvider } from '@domain/contracts/providers/email/send.email-provider';
import { IGenerateUuidProvider } from '@domain/contracts/providers/uuid/generate-uuid.provider';
import { ISaveSentEmailsRepository } from '@domain/contracts/repositories/email/sent-emails/save.sent-emails-repository';
import { EmailTemplateError } from '@domain/entities/errors/email/email-template.error';
import { ISendEmailUseCase, SendEmailUseCaseDTO } from '@domain/use-cases/emails/send-email/send-email.use-case';

import { failure, success } from '@shared/utils/either.util';

export class SendEmailUseCase implements ISendEmailUseCase {
  public constructor(
    private readonly emailProvider: ISendEmailProvider,
    private readonly sentEmailsRepository: ISaveSentEmailsRepository,
    private readonly uuidProvider: IGenerateUuidProvider,
    private readonly emailTemplateProvider: IAddVariablesInEmailTemplateProvider
  ) {}

  public async execute(parameters: SendEmailUseCaseDTO.Parameters): SendEmailUseCaseDTO.Result {
    if (parameters.emailData.status !== 'active') {
      return failure(
        new EmailTemplateError({
          motive: 'is not active'
        })
      );
    }

    const resultAddedVariables = await this.emailTemplateProvider.addVariablesInEmailTemplate({
      htmlEmailTemplate: parameters.emailData.html,
      variables: parameters.variables
    });
    if (resultAddedVariables.isFailure()) {
      return failure(resultAddedVariables.value);
    }

    const sentEmail = await this.emailProvider.send({
      from: {
        email: parameters.emailData.from.email,
        name: parameters.emailData.from.name
      },
      html: resultAddedVariables.value.html,
      subject: parameters.emailData.subject,
      to: {
        email: parameters.emailData.to.email,
        name: parameters.emailData.to.name
      }
    });

    if (sentEmail.isFailure()) {
      return failure(sentEmail.value);
    }

    const resultGenerateUuid = this.uuidProvider.generate();
    if (resultGenerateUuid.isFailure()) {
      return failure(resultGenerateUuid.value);
    }

    const resultSaveSentEmail = await this.sentEmailsRepository.save({
      id: resultGenerateUuid.value.uuid,
      sentEmailResult: sentEmail.value.result,
      providerSentEmail: sentEmail.value.provider,
      requester: {
        id: parameters.requester.id
      },
      sentEmail: {
        to: {
          name: parameters.emailData.to.name,
          email: parameters.emailData.to.email
        },
        from: {
          name: parameters.emailData.from.name,
          email: parameters.emailData.from.email
        },
        subject: parameters.emailData.subject,
        html: resultAddedVariables.value.html
      }
    });

    if (resultSaveSentEmail.isFailure()) {
      return failure(resultSaveSentEmail.value);
    }

    return success(undefined);
  }
}
