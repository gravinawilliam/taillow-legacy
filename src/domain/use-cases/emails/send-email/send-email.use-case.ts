import { EmailTemplateError } from '@domain/entities/errors/email/email-template.error';
import { ProviderError } from '@domain/entities/errors/shared/provider.error';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { EmailContact } from '@domain/entities/models/email/email-contact.model';
import { EmailTemplateStatus } from '@domain/entities/models/email/email-template.model';

import { Either } from '@shared/utils/either.util';

export namespace SendEmailUseCaseDTO {
  export type Parameters = {
    emailData: {
      subject: string;
      html: string;
      to: EmailContact;
      from: EmailContact;
      status: EmailTemplateStatus;
    };
    requester: {
      id: string;
    };
    variables: {
      [key: string]: string;
    };
  };

  export type ResultError = RepositoryError | ProviderError | EmailTemplateError;
  export type ResultSuccess = undefined;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISendEmailUseCase {
  execute(parameters: SendEmailUseCaseDTO.Parameters): SendEmailUseCaseDTO.Result;
}
