import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { Requester } from '@domain/entities/models/requester/requester.model';

import { Either } from '@shared/utils/either.util';

export namespace FindRequestersRepositoryDTO {
  export type Parameters = {
    requester: {
      apiKey: string;
    };
  };

  type ResultError = RepositoryError;
  type ResultSuccess = {
    requester?: Requester;
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IFindRequestersRepository {
  find(parameters: FindRequestersRepositoryDTO.Parameters): FindRequestersRepositoryDTO.Result;
}
