import { IFindEmailDomainsRepository } from '@domain/contracts/repositories/email/email-domains/find-email-domains.repository';

import { EmailDomainsPrismaRepository } from '@infrastructure/database/prisma/repositories/email-domains.prisma-repository';

export const makeEmailDomainsRepository = (): IFindEmailDomainsRepository => {
  return new EmailDomainsPrismaRepository();
};
