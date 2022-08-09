import { VerifyApiKeyUseCase } from '@application/use-cases/requesters/verify-api-key.use-case';

import { IFindRequestersRepository } from '@domain/contracts/repositories/requesters/find-requesters.repository';
import { IVerifyApiKeyUseCase } from '@domain/use-cases/requesters/verify-api-key.use-case';

import { makeRequestersRepository } from '@main/factories/repositories/requesters-repository.factory';

export const makeVerifyApiKeyUseCase = (): IVerifyApiKeyUseCase => {
  const requestersRepository: IFindRequestersRepository = makeRequestersRepository();
  return new VerifyApiKeyUseCase(requestersRepository);
};
