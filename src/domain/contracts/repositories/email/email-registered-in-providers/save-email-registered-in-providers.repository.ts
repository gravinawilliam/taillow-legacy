import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { EmailRegisteredInProvider } from '@domain/entities/models/email/email-registered-in-providers.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveEmailRegisteredInProvidersRepositoryDTO {
  export type Parameters = {
    emailRegisteredInProvider: EmailRegisteredInProvider & {
      id: string;
    };
  };

  type ResultError = RepositoryError;
  type ResultSuccess = undefined;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISaveEmailRegisteredInProvidersRepository {
  save(
    parameters: SaveEmailRegisteredInProvidersRepositoryDTO.Parameters
  ): SaveEmailRegisteredInProvidersRepositoryDTO.Result;
}
