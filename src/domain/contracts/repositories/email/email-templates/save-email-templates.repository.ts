import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { EmailTemplate } from '@domain/entities/models/email/email-template.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveEmailTemplatesRepositoryDTO {
  export type Parameters = {
    emailTemplate: EmailTemplate;
  };

  type ResultError = RepositoryError;
  type ResultSuccess = undefined;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISaveEmailTemplatesRepository {
  save(parameters: SaveEmailTemplatesRepositoryDTO.Parameters): SaveEmailTemplatesRepositoryDTO.Result;
}
