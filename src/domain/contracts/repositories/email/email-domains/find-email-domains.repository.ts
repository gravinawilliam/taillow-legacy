import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { EmailDomain } from '@domain/entities/models/email/email-domain.model';

import { Either } from '@shared/utils/either.util';

export namespace FindEmailDomainsRepositoryDTO {
  export type Parameters = {
    domain: string;
  };

  type ResultError = RepositoryError;
  type ResultSuccess = {
    emailDomain?: EmailDomain;
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IFindEmailDomainsRepository {
  find(parameters: FindEmailDomainsRepositoryDTO.Parameters): FindEmailDomainsRepositoryDTO.Result;
}
