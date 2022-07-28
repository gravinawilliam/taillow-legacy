import { EmailTemplateError } from '@domain/entities/errors/email/email-template.error';
import { InvalidContentParameterError } from '@domain/entities/errors/shared/invalid-content-parameter.error';
import { NotExistModelError } from '@domain/entities/errors/shared/not-exist-model.error';
import { ProviderError } from '@domain/entities/errors/shared/provider.error';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';

import { Either } from '@shared/utils/either.util';

export namespace SendEmailControllerDTO {
  export type Parameters = {
    requester: {
      apiKey: string;
    };
    emailData: {
      to: {
        name: string;
        email: string;
      };
      emailTemplate: {
        id: string;
        variables: {
          [key: string]: string;
        };
      };
    };
  };

  export type ResultError =
    | RepositoryError
    | ProviderError
    | NotExistModelError
    | InvalidContentParameterError
    | EmailTemplateError;
  export type ResultSuccess = undefined;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISendEmailController {
  handle(parameters: SendEmailControllerDTO.Parameters): SendEmailControllerDTO.Result;
}
