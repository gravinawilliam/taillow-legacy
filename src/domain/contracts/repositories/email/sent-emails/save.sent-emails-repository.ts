import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { EmailContact } from '@domain/entities/models/email/email-contact.model';
import { ProvidersSendEmail } from '@domain/entities/models/email/email-registered-in-providers.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveSentEmailsRepositoryDTO {
  export type Parameters = {
    id: string;
    requester: {
      id: string;
    };
    sentEmail: {
      to: EmailContact;
      from: EmailContact;
      subject: string;
      html: string;
    };
    sentEmailResult: unknown;
    providerSentEmail: ProvidersSendEmail;
  };

  type ResultError = RepositoryError;
  type ResultSuccess = undefined;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISaveSentEmailsRepository {
  save(parameters: SaveSentEmailsRepositoryDTO.Parameters): SaveSentEmailsRepositoryDTO.Result;
}
