import { ISendErrorLoggerProvider } from '@domain/contracts/providers/logger/send-error-logger.provider';
import { ISaveEmailsNotSentRepository } from '@domain/contracts/repositories/email/emails-not-sent/save.emails-not-sent-repository';

import { EmailsNotSentPrismaRepository } from '@infrastructure/database/prisma/repositories/emails-not-sent.prisma-repository';

import { makeLoggerProvider } from '@main/factories/providers/logger-provider.factory';

export const makeEmailsNotSentRepository = (): ISaveEmailsNotSentRepository => {
  const loggerProvider: ISendErrorLoggerProvider = makeLoggerProvider();
  return new EmailsNotSentPrismaRepository(loggerProvider);
};
