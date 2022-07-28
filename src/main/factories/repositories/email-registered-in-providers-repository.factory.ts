import { ISaveEmailRegisteredInProvidersRepository } from '@domain/contracts/repositories/email/email-registered-in-providers/save-email-registered-in-providers.repository';

import { EmailRegisteredInProvidersPrismaRepository } from '@infrastructure/database/prisma/repositories/email-registered-in-providers.prisma-repository';

export const makeEmailRegisteredInProvidersRepository = (): ISaveEmailRegisteredInProvidersRepository => {
  return new EmailRegisteredInProvidersPrismaRepository();
};
