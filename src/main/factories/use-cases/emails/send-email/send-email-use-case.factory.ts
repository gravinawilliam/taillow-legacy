import { SendEmailUseCase } from '@application/use-cases/emails/send-email/send-email.use-case';

import { IAddVariablesInEmailTemplateProvider } from '@domain/contracts/providers/email-template/add-variables-in-email-template.provider';
import { ISendEmailProvider } from '@domain/contracts/providers/email/send.email-provider';
import { IGenerateUuidProvider } from '@domain/contracts/providers/uuid/generate-uuid.provider';
import { ISaveSentEmailsRepository } from '@domain/contracts/repositories/email/sent-emails/save.sent-emails-repository';
import { ISendEmailUseCase } from '@domain/use-cases/emails/send-email/send-email.use-case';

import { makeEmailTemplateProvider } from '@main/factories/providers/email-template-provider.factory';
import { makeSendEmailProvider } from '@main/factories/providers/send-email-provider.factory';
import { makeUuidProvider } from '@main/factories/providers/uuid-provider.factory';
import { makeSentEmailsRepository } from '@main/factories/repositories/sent-emails-repository.factory';

export const makeSendEmailUseCase = (): ISendEmailUseCase => {
  const emailProvider: ISendEmailProvider = makeSendEmailProvider();
  const sentEmailsRepository: ISaveSentEmailsRepository = makeSentEmailsRepository();
  const uuidProvider: IGenerateUuidProvider = makeUuidProvider();
  const emailTemplateProvider: IAddVariablesInEmailTemplateProvider = makeEmailTemplateProvider();

  return new SendEmailUseCase(emailProvider, sentEmailsRepository, uuidProvider, emailTemplateProvider);
};
