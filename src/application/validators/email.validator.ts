import { InvalidContentParameterError } from '@domain/entities/errors/shared/invalid-content-parameter.error';
import { EmailValidatorDTO, IEmailValidator } from '@domain/validators/email.validator';

import { failure, success } from '@shared/utils/either.util';

export class EmailValidator implements IEmailValidator {
  public validate(parameters: EmailValidatorDTO.Parameters): EmailValidatorDTO.Result {
    const MAX_EMAIL_SIZE = 320;

    if (this.emptyOrTooLarge(parameters.email, MAX_EMAIL_SIZE) || this.nonConformant(parameters.email)) {
      return failure(
        new InvalidContentParameterError({
          messageDefault: {
            parameter: 'email',
            content: parameters.email
          }
        })
      );
    }

    const [local, domain] = parameters.email.split('@');
    const MAX_LOCAL_SIZE = 64;
    const MAX_DOMAIN_SIZE = 255;

    if (this.emptyOrTooLarge(local, MAX_LOCAL_SIZE) || this.emptyOrTooLarge(domain, MAX_DOMAIN_SIZE)) {
      return failure(
        new InvalidContentParameterError({
          messageDefault: {
            parameter: 'email',
            content: parameters.email
          }
        })
      );
    }

    if (this.somePartIsTooLargeIn(domain)) {
      return failure(
        new InvalidContentParameterError({
          messageDefault: {
            parameter: 'email',
            content: parameters.email
          }
        })
      );
    }

    return success({
      emailValidated: parameters.email.toLowerCase()
    });
  }

  private emptyOrTooLarge(string_: string, maxSize: number): boolean {
    return !string_ || string_.length > maxSize;
  }

  private nonConformant(email: string): boolean {
    const emailRegex =
      /^[\w!#$%&'*+/=?^`{|}~-](\.?[\w!#$%&'*+/=?^`{|}~-])*@[\dA-Za-z](-*\.?[\dA-Za-z])*\.[A-Za-z](-?[\dA-Za-z])+$/;

    return !emailRegex.test(email);
  }

  private somePartIsTooLargeIn(domain: string): boolean {
    const maxPartSize = 63;
    const domainParts = domain.split('.');
    return domainParts.some(part => part.length > maxPartSize);
  }
}
