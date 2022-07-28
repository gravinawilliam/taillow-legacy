import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { EmailContact } from '@domain/entities/models/email/email-contact.model';

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
  };

  type ResultError = RepositoryError;
  type ResultSuccess = undefined;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISaveSentEmailsRepository {
  save(parameters: SaveSentEmailsRepositoryDTO.Parameters): SaveSentEmailsRepositoryDTO.Result;
}
