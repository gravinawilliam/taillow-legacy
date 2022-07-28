import { ISaveEmailsNotSentRepository } from '@domain/contracts/repositories/email/emails-not-sent/save.emails-not-sent-repository';
import {
  ISendEmailController,
  SendEmailControllerDTO
} from '@domain/controllers/emails/send-email/send-email.controller';
import { Email } from '@domain/entities/models/email/email.model';
import { IFindEmailTemplateUseCase } from '@domain/use-cases/emails/email-templates/find-email-template.use-case';
import { ISendEmailUseCase } from '@domain/use-cases/emails/send-email/send-email.use-case';
import { IVerifyApiKeyUseCase } from '@domain/use-cases/requesters/verify-api-key.use-case';

import { failure, success } from '@shared/utils/either.util';

export class SendEmailController implements ISendEmailController {
  constructor(
    private readonly sendEmailUseCase: ISendEmailUseCase,
    private readonly verifyApiKeyUseCase: IVerifyApiKeyUseCase,
    private readonly findEmailTemplateUseCase: IFindEmailTemplateUseCase,
    private readonly emailsNotSentRepository: ISaveEmailsNotSentRepository
  ) {}

  public async handle(parameters: SendEmailControllerDTO.Parameters): SendEmailControllerDTO.Result {
    const resultVerifyApiKey = await this.verifyApiKeyUseCase.execute({
      requester: {
        apiKey: parameters.requester.apiKey
      }
    });
    if (resultVerifyApiKey.isFailure()) {
      this.emailsNotSentRepository.save({
        errorNotSentEmail: resultVerifyApiKey.value,
        requester: {
          apiKey: parameters.requester.apiKey
        },
        sentEmail: {
          to: {
            email: parameters.emailData.to.email,
            name: parameters.emailData.to.name
          }
        },
        template: {
          id: parameters.emailData.emailTemplate.id,
          variables: parameters.emailData.emailTemplate.variables
        }
      });
      return failure(resultVerifyApiKey.value);
    }

    const resultFindEmailTemplateUseCase = await this.findEmailTemplateUseCase.execute({
      requester: {
        id: resultVerifyApiKey.value.requester.id
      },
      template: {
        id: parameters.emailData.emailTemplate.id
      }
    });
    if (resultFindEmailTemplateUseCase.isFailure()) {
      this.emailsNotSentRepository.save({
        errorNotSentEmail: resultFindEmailTemplateUseCase.value,
        requester: {
          apiKey: parameters.requester.apiKey
        },
        sentEmail: {
          to: {
            email: parameters.emailData.to.email,
            name: parameters.emailData.to.name
          }
        },
        template: {
          id: parameters.emailData.emailTemplate.id,
          variables: parameters.emailData.emailTemplate.variables
        }
      });
      return failure(resultFindEmailTemplateUseCase.value);
    }

    const createdEmailTo = Email.create({ email: parameters.emailData.to.email });
    if (createdEmailTo.isFailure()) {
      this.emailsNotSentRepository.save({
        errorNotSentEmail: createdEmailTo.value,
        requester: {
          apiKey: parameters.requester.apiKey
        },
        sentEmail: {
          to: {
            email: parameters.emailData.to.email,
            name: parameters.emailData.to.name
          }
        },
        template: {
          id: parameters.emailData.emailTemplate.id,
          variables: parameters.emailData.emailTemplate.variables
        }
      });
      return failure(createdEmailTo.value);
    }

    const resultSendEmail = await this.sendEmailUseCase.execute({
      requester: {
        id: resultVerifyApiKey.value.requester.id
      },
      variables: parameters.emailData.emailTemplate.variables,
      emailData: {
        status: resultFindEmailTemplateUseCase.value.emailTemplate.status,
        to: {
          name: parameters.emailData.to.name,
          email: createdEmailTo.value
        },
        from: {
          name: resultFindEmailTemplateUseCase.value.emailTemplate.fromEmailContact.name,
          email: resultFindEmailTemplateUseCase.value.emailTemplate.fromEmailContact.email
        },
        html: resultFindEmailTemplateUseCase.value.emailTemplate.html,
        subject: resultFindEmailTemplateUseCase.value.emailTemplate.subject
      }
    });
    if (resultSendEmail.isFailure()) {
      this.emailsNotSentRepository.save({
        errorNotSentEmail: resultSendEmail.value,
        requester: {
          apiKey: parameters.requester.apiKey
        },
        sentEmail: {
          to: {
            email: parameters.emailData.to.email,
            name: parameters.emailData.to.name
          }
        },
        template: {
          id: parameters.emailData.emailTemplate.id,
          variables: parameters.emailData.emailTemplate.variables
        }
      });
      return failure(resultSendEmail.value);
    }

    return success(undefined);
  }
}
