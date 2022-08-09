import { EmailTemplateError } from '@domain/entities/errors/email/email-template.error';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { EmailTemplateStatus } from '@domain/entities/models/email/email-template.model';
import { Email } from '@domain/entities/models/email/email.model';

import { Either } from '@shared/utils/either.util';

export namespace FindEmailTemplateUseCaseDTO {
  export type Parameters = {
    template: {
      id: string;
    };
    requester: {
      id: string;
    };
  };

  export type ResultError = RepositoryError | EmailTemplateError;
  export type ResultSuccess = {
    emailTemplate: {
      id: string;
      html: string;
      description: string;
      subject: string;
      fromEmailContact: {
        name: string;
        email: Email;
      };
      status: EmailTemplateStatus;
    };
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IFindEmailTemplateUseCase {
  execute(parameters: FindEmailTemplateUseCaseDTO.Parameters): FindEmailTemplateUseCaseDTO.Result;
}
