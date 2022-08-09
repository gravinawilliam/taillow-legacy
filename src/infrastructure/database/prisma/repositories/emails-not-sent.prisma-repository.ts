import crypto from 'crypto';

import { ISendErrorLoggerProvider } from '@domain/contracts/providers/logger/send-error-logger.provider';
import {
  ISaveEmailsNotSentRepository,
  SaveEmailsNotSentRepositoryDTO
} from '@domain/contracts/repositories/email/emails-not-sent/save.emails-not-sent-repository';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';

import { prisma } from '@infrastructure/database/prisma/prisma';

import { failure, success } from '@shared/utils/either.util';

export class EmailsNotSentPrismaRepository implements ISaveEmailsNotSentRepository {
  constructor(private readonly loggerProvider: ISendErrorLoggerProvider) {}

  public async save(parameters: SaveEmailsNotSentRepositoryDTO.Parameters): SaveEmailsNotSentRepositoryDTO.Result {
    try {
      await prisma.emailNotSent.create({
        data: {
          requesterId: parameters.requester.id,
          toEmail: parameters.sentEmail.to.email,
          toName: parameters.sentEmail.to.name,
          errorNotSentEmail: JSON.stringify(parameters.errorNotSentEmail),
          templateVariables: JSON.stringify(parameters.template?.variables),
          id: crypto.randomUUID(),
          requesterApiKey: parameters.requester.apiKey,
          fromEmail: parameters.sentEmail.from?.email,
          fromName: parameters.sentEmail.from?.name,
          subject: parameters.sentEmail.subject,
          html: parameters.sentEmail.html,
          templateId: parameters.template?.id
        }
      });

      return success(undefined);
    } catch (error: any) {
      this.loggerProvider.error({
        message: 'Error saving email not sent repository',
        value: error
      });
      return failure(
        new RepositoryError({
          method: 'save',
          model: 'email not sent',
          error
        })
      );
    }
  }
}
