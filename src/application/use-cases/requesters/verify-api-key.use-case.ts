import { IFindRequestersRepository } from '@domain/contracts/repositories/requesters/find-requesters.repository';
import { NotExistModelError } from '@domain/entities/errors/shared/not-exist-model.error';
import { IVerifyApiKeyUseCase, VerifyApiKeyUseCaseDTO } from '@domain/use-cases/requesters/verify-api-key.use-case';

import { failure, success } from '@shared/utils/either.util';

export class VerifyApiKeyUseCase implements IVerifyApiKeyUseCase {
  constructor(private readonly requestersRepository: IFindRequestersRepository) {}

  public async execute(parameters: VerifyApiKeyUseCaseDTO.Parameters): VerifyApiKeyUseCaseDTO.Result {
    const resultFindRequestersRepository = await this.requestersRepository.find({
      requester: {
        apiKey: parameters.requester.apiKey
      }
    });
    if (resultFindRequestersRepository.isFailure()) return failure(resultFindRequestersRepository.value);
    if (resultFindRequestersRepository.value.requester === undefined) {
      return failure(
        new NotExistModelError({
          model: 'Requester'
        })
      );
    }

    return success({
      requester: {
        id: resultFindRequestersRepository.value.requester.id
      }
    });
  }
}
