import { IFindEmailTemplatesRepository } from '@domain/contracts/repositories/email/email-templates/find-email-templates.repository';
import { EmailTemplateError } from '@domain/entities/errors/email/email-template.error';
import {
  FindEmailTemplateUseCaseDTO,
  IFindEmailTemplateUseCase
} from '@domain/use-cases/emails/email-templates/find-email-template.use-case';

import { success, failure } from '@shared/utils/either.util';

export class FindEmailTemplateUseCase implements IFindEmailTemplateUseCase {
  constructor(private readonly emailTemplatesRepository: IFindEmailTemplatesRepository) {}

  public async execute(parameters: FindEmailTemplateUseCaseDTO.Parameters): FindEmailTemplateUseCaseDTO.Result {
    const resultFindEmailTemplate = await this.emailTemplatesRepository.find({
      template: {
        id: parameters.template.id,
        requester: {
          id: parameters.requester.id
        }
      }
    });
    if (resultFindEmailTemplate.isFailure()) return failure(resultFindEmailTemplate.value);

    if (resultFindEmailTemplate.value.emailTemplate === undefined) {
      return failure(new EmailTemplateError({ motive: 'is not exist' }));
    }

    const { emailTemplate } = resultFindEmailTemplate.value;

    return success({
      emailTemplate: {
        description: emailTemplate.description,
        fromEmailContact: {
          email: emailTemplate.fromEmailContact.email,
          name: emailTemplate.fromEmailContact.name
        },
        html: emailTemplate.html,
        id: emailTemplate.id,
        status: emailTemplate.status,
        subject: emailTemplate.subject
      }
    });
  }
}
