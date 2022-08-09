import { SendEmailController } from '@application/controllers/emails/send-email/send-email.controller';

import { ISaveEmailsNotSentRepository } from '@domain/contracts/repositories/email/emails-not-sent/save.emails-not-sent-repository';
import { ISendEmailController } from '@domain/controllers/emails/send-email/send-email.controller';
import { IFindEmailTemplateUseCase } from '@domain/use-cases/emails/email-templates/find-email-template.use-case';
import { ISendEmailUseCase } from '@domain/use-cases/emails/send-email/send-email.use-case';
import { IVerifyApiKeyUseCase } from '@domain/use-cases/requesters/verify-api-key.use-case';

import { makeEmailsNotSentRepository } from '@main/factories/repositories/emails-not-sent-repository.factory';
import { makeFindEmailTemplateUseCase } from '@main/factories/use-cases/emails/email-templates/find-email-template-use-case.factory';
import { makeSendEmailUseCase } from '@main/factories/use-cases/emails/send-email/send-email-use-case.factory';
import { makeVerifyApiKeyUseCase } from '@main/factories/use-cases/requesters/verify-api-key-use-case.factory';

export const makeSendEmailController = (): ISendEmailController => {
  const sendEmailUseCase: ISendEmailUseCase = makeSendEmailUseCase();
  const verifyApiKeyUseCase: IVerifyApiKeyUseCase = makeVerifyApiKeyUseCase();
  const findEmailTemplateUseCase: IFindEmailTemplateUseCase = makeFindEmailTemplateUseCase();
  const emailsNotSentRepository: ISaveEmailsNotSentRepository = makeEmailsNotSentRepository();

  return new SendEmailController(
    sendEmailUseCase,
    verifyApiKeyUseCase,
    findEmailTemplateUseCase,
    emailsNotSentRepository
  );
};
