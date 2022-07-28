import { ISaveSentEmailsRepository } from '@domain/contracts/repositories/email/sent-emails/save.sent-emails-repository';

import { SentEmailsPrismaRepository } from '@infrastructure/database/prisma/repositories/sent-emails.prisma-repository';

export const makeSentEmailsRepository = (): ISaveSentEmailsRepository => {
  return new SentEmailsPrismaRepository();
};
