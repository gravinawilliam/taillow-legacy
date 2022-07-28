import { IGenerateUuidProvider } from '@domain/contracts/providers/uuid/generate-uuid.provider';
import { ISaveEmailTemplatesRepository } from '@domain/contracts/repositories/email/email-templates/save-email-templates.repository';
import { InvalidContentParameterError } from '@domain/entities/errors/shared/invalid-content-parameter.error';
import {
  CreateEmailTemplateUseCaseDTO,
  ICreateEmailTemplateUseCase
} from '@domain/use-cases/emails/email-templates/create-email-template.use-case';

import { failure, success } from '@shared/utils/either.util';

export class CreateEmailTemplateUseCase implements ICreateEmailTemplateUseCase {
  constructor(
    private readonly emailTemplatesRepository: ISaveEmailTemplatesRepository,
    private readonly uuidProvider: IGenerateUuidProvider
  ) {}

  public async execute(parameters: CreateEmailTemplateUseCaseDTO.Parameters): CreateEmailTemplateUseCaseDTO.Result {
    const MINIMUM_TEMPLATE_NAME_SIZE = 5;

    if (parameters.template.name.length < MINIMUM_TEMPLATE_NAME_SIZE) {
      return failure(
        new InvalidContentParameterError({
          customMessage: 'The email template name must be at least 5 characters long.'
        })
      );
    }
    const MINIMUM_TEMPLATE_DESCRIPTION_SIZE = 0;
    if (parameters.template.description.length === MINIMUM_TEMPLATE_DESCRIPTION_SIZE) {
      return failure(
        new InvalidContentParameterError({
          customMessage: 'The email template description must be at least 0 characters long.'
        })
      );
    }
    const MINIMUM_TEMPLATE_SUBJECT_SIZE = 0;
    if (parameters.template.subject.length === MINIMUM_TEMPLATE_SUBJECT_SIZE) {
      return failure(
        new InvalidContentParameterError({
          customMessage: 'The email template subject must be at least 0 characters long.'
        })
      );
    }

    const resultGenerateUuid = this.uuidProvider.generate();
    if (resultGenerateUuid.isFailure()) return failure(resultGenerateUuid.value);

    const resultSaveEmailTemplate = await this.emailTemplatesRepository.save({
      emailTemplate: {
        description: parameters.template.description,
        fromEmailContact: {
          id: parameters.template.fromEmailContact.id
        },
        html: parameters.template.html,
        id: resultGenerateUuid.value.uuid,
        name: parameters.template.name,
        requester: {
          id: parameters.requester.id
        },
        status: 'awaiting review',
        subject: parameters.template.subject
      }
    });
    if (resultSaveEmailTemplate.isFailure()) {
      return failure(resultSaveEmailTemplate.value);
    }

    return success({
      template: {
        id: resultGenerateUuid.value.uuid
      }
    });
  }
}
