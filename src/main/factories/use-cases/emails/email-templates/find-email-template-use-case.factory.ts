import { FindEmailTemplateUseCase } from '@application/use-cases/emails/email-templates/find-email-template.use-case';

import { IFindEmailTemplatesRepository } from '@domain/contracts/repositories/email/email-templates/find-email-templates.repository';
import { IFindEmailTemplateUseCase } from '@domain/use-cases/emails/email-templates/find-email-template.use-case';

import { makeEmailTemplatesRepository } from '@main/factories/repositories/email-templates-repository.factory';

export const makeFindEmailTemplateUseCase = (): IFindEmailTemplateUseCase => {
  const emailTemplatesRepository: IFindEmailTemplatesRepository = makeEmailTemplatesRepository();
  return new FindEmailTemplateUseCase(emailTemplatesRepository);
};
