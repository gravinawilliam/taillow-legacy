import { EmailDomainError } from '@domain/entities/errors/email/email-domain.error';
import { InvalidContentParameterError } from '@domain/entities/errors/shared/invalid-content-parameter.error';
import { NotExistModelError } from '@domain/entities/errors/shared/not-exist-model.error';
import { ProviderError } from '@domain/entities/errors/shared/provider.error';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';

import { Either } from '@shared/utils/either.util';

export namespace CreateEmailContactUseCaseDTO {
  export type Parameters = {
    emailContact: {
      name: string;
      email: string;
    };
    requester: {
      id: string;
    };
  };

  export type ResultError =
    | RepositoryError
    | InvalidContentParameterError
    | NotExistModelError
    | EmailDomainError
    | ProviderError;
  export type ResultSuccess = {
    emailContact: {
      id: string;
    };
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ICreateEmailContactUseCase {
  execute(parameters: CreateEmailContactUseCaseDTO.Parameters): CreateEmailContactUseCaseDTO.Result;
}
