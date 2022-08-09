import { EmailValidator } from '@application/validators/email.validator';

import { InvalidContentParameterError } from '@domain/entities/errors/shared/invalid-content-parameter.error';

import { Either, failure, success } from '@shared/utils/either.util';

export class Email {
  public readonly value: string;

  private constructor(email: string) {
    this.value = email;
    Object.freeze(this);
  }

  public static create({ email }: CreateEmailDTO.Parameters): CreateEmailDTO.Result {
    const validated = new EmailValidator().validate({ email });
    if (validated.isFailure()) return failure(validated.value);
    return success(new Email(email));
  }
}

export namespace CreateEmailDTO {
  export type Parameters = { email: string };
  export type Result = Either<InvalidContentParameterError, Email>;
}
