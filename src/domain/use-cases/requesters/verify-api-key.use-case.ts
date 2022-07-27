import { NotExistModelError } from '@domain/entities/errors/shared/not-exist-model.error';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';

import { Either } from '@shared/utils/either.util';

export namespace VerifyApiKeyUseCaseDTO {
  export type Parameters = {
    requester: {
      apiKey: string;
    };
  };

  export type ResultError = RepositoryError | NotExistModelError;
  export type ResultSuccess = {
    requester: {
      id: string;
    };
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IVerifyApiKeyUseCase {
  execute(parameters: VerifyApiKeyUseCaseDTO.Parameters): VerifyApiKeyUseCaseDTO.Result;
}
