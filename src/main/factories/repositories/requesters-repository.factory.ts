import { IFindRequestersRepository } from '@domain/contracts/repositories/requesters/find-requesters.repository';

import { RequestersPrismaRepository } from '@infrastructure/database/prisma/repositories/requesters.prisma-repository';

export const makeRequestersRepository = (): IFindRequestersRepository => {
  return new RequestersPrismaRepository();
};
