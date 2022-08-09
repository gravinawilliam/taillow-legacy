import { IFindEmailTemplatesRepository } from '@domain/contracts/repositories/email/email-templates/find-email-templates.repository';
import { ISaveEmailTemplatesRepository } from '@domain/contracts/repositories/email/email-templates/save-email-templates.repository';

import { EmailTemplatesPrismaRepository } from '@infrastructure/database/prisma/repositories/email-templates.prisma-repository';

export const makeEmailTemplatesRepository = (): IFindEmailTemplatesRepository & ISaveEmailTemplatesRepository => {
  return new EmailTemplatesPrismaRepository();
};
