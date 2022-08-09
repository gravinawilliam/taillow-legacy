import { EmailDomainError } from '@domain/entities/errors/email/email-domain.error';
import { InvalidContentParameterError } from '@domain/entities/errors/shared/invalid-content-parameter.error';
import { NotExistModelError } from '@domain/entities/errors/shared/not-exist-model.error';
import { ProviderError } from '@domain/entities/errors/shared/provider.error';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';

import { Either } from '@shared/utils/either.util';

export namespace CreateEmailTemplateUseCaseDTO {
  export type Parameters = {
    template: {
      name: string;
      description: string;
      subject: string;
      html: string;
      fromEmailContact: {
        id: string;
      };
    };
    requester: {
      id: string;
    };
  };

  export type ResultError =
    | InvalidContentParameterError
    | NotExistModelError
    | EmailDomainError
    | RepositoryError
    | ProviderError;
  export type ResultSuccess = {
    template: {
      id: string;
    };
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ICreateEmailTemplateUseCase {
  execute(parameters: CreateEmailTemplateUseCaseDTO.Parameters): CreateEmailTemplateUseCaseDTO.Result;
}
