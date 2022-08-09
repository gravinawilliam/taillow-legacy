import { ProviderError } from '@domain/entities/errors/shared/provider.error';
import { EmailContact } from '@domain/entities/models/email/email-contact.model';
import { ProvidersSendEmail } from '@domain/entities/models/email/email-registered-in-providers.model';

import { Either } from '@shared/utils/either.util';

export namespace SendEmailProviderDTO {
  export type Parameters = {
    to: EmailContact;
    from: EmailContact;
    subject: string;
    html: string;
  };

  export type ResultError = ProviderError;
  type ResultSuccess = {
    result: unknown;
    provider: ProvidersSendEmail;
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISendEmailProvider {
  send(parameters: SendEmailProviderDTO.Parameters): SendEmailProviderDTO.Result;
}
