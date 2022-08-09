import { RepositoryError } from '@domain/entities/errors/shared/repository.error';

import { Either } from '@shared/utils/either.util';

export namespace SaveEmailsNotSentRepositoryDTO {
  export type Parameters = {
    requester: {
      apiKey: string; //
      id?: string; //
    };
    template?: {
      id: string;
      variables: unknown;
    };
    sentEmail: {
      to: {
        name: string; //
        email: string; //
      };
      from?: {
        name: string; //
        email: string; //
      };
      subject?: string; //
      html?: string; //
    };
    errorNotSentEmail: unknown; //
  };

  type ResultError = RepositoryError;
  type ResultSuccess = undefined;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISaveEmailsNotSentRepository {
  save(parameters: SaveEmailsNotSentRepositoryDTO.Parameters): SaveEmailsNotSentRepositoryDTO.Result;
}
