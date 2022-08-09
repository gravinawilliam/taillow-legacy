import { InvalidContentParameterError } from '@domain/entities/errors/shared/invalid-content-parameter.error';

import { Either } from '@shared/utils/either.util';

export namespace EmailValidatorDTO {
  export type Parameters = {
    email: string;
  };

  type ResultError = InvalidContentParameterError;
  type ResultSuccess = { emailValidated: string };

  export type Result = Either<ResultError, ResultSuccess>;
}

export interface IEmailValidator {
  validate(parameters: EmailValidatorDTO.Parameters): EmailValidatorDTO.Result;
}
