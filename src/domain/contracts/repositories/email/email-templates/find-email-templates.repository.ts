import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { EmailContact } from '@domain/entities/models/email/email-contact.model';
import { EmailTemplate } from '@domain/entities/models/email/email-template.model';

import { Either } from '@shared/utils/either.util';

export namespace FindEmailTemplatesRepositoryDTO {
  export type Parameters = {
    template: {
      id: string;
      requester: {
        id: string;
      };
    };
  };

  type ResultError = RepositoryError;
  type ResultSuccess = {
    emailTemplate?: EmailTemplate & {
      fromEmailContact: EmailContact;
    };
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IFindEmailTemplatesRepository {
  find(parameters: FindEmailTemplatesRepositoryDTO.Parameters): FindEmailTemplatesRepositoryDTO.Result;
}
