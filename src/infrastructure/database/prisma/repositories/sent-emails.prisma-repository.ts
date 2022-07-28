import {
  ISaveSentEmailsRepository,
  SaveSentEmailsRepositoryDTO
} from '@domain/contracts/repositories/email/sent-emails/save.sent-emails-repository';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';

import { prisma } from '@infrastructure/database/prisma/prisma';

import { failure, success } from '@shared/utils/either.util';

export class SentEmailsPrismaRepository implements ISaveSentEmailsRepository {
  public async save(parameters: SaveSentEmailsRepositoryDTO.Parameters): SaveSentEmailsRepositoryDTO.Result {
    try {
      await prisma.sentEmail.create({
        data: {
          fromEmail: parameters.sentEmail.from.email.value,
          fromName: parameters.sentEmail.from.name,
          html: parameters.sentEmail.html,
          requesterId: parameters.requester.id,
          subject: parameters.sentEmail.subject,
          toEmail: parameters.sentEmail.to.email.value,
          toName: parameters.sentEmail.to.name,
          id: parameters.id,
          providerSentEmail: parameters.providerSentEmail,
          sentEmailResult: JSON.stringify(parameters.sentEmailResult)
        }
      });

      return success(undefined);
    } catch (error: any) {
      return failure(
        new RepositoryError({
          method: 'save',
          model: 'sent email',
          error
        })
      );
    }
  }
}
