import { mock, MockProxy } from 'jest-mock-extended';

import { VerifyApiKeyUseCase } from '@application/use-cases/requesters/verify-api-key.use-case';

import { IFindRequestersRepository } from '@domain/contracts/repositories/requesters/find-requesters.repository';
import { NotExistModelError } from '@domain/entities/errors/shared/not-exist-model.error';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { IVerifyApiKeyUseCase, VerifyApiKeyUseCaseDTO } from '@domain/use-cases/requesters/verify-api-key.use-case';

import { success, failure } from '@shared/utils/either.util';

describe('Create Email Template Use Case', () => {
  let sut: IVerifyApiKeyUseCase;

  let requestersRepository: MockProxy<IFindRequestersRepository>;

  beforeAll(() => {
    requestersRepository = mock();
    requestersRepository.find.mockResolvedValue(
      success({
        requester: {
          apiKey: '5c0dda3563d0',
          id: '7bb55805-faa7-4844-9eba-f1fc9f02812d'
        }
      })
    );
  });

  beforeEach(() => {
    sut = new VerifyApiKeyUseCase(requestersRepository);
  });

  it('should return an error when find requesters repository return RepositoryError', async () => {
    requestersRepository.find.mockResolvedValueOnce(
      failure(
        new RepositoryError({
          method: 'find',
          model: 'requester'
        })
      )
    );

    const result = await sut.execute({
      requester: { apiKey: '5c0dda3563d0' }
    });

    expect(result.value).toEqual(
      new RepositoryError({
        method: 'find',
        model: 'requester'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return an error when find requesters return undefined', async () => {
    requestersRepository.find.mockResolvedValueOnce(
      success({
        requester: undefined
      })
    );

    const result = await sut.execute({
      requester: { apiKey: 'no_exists_api_key' }
    });

    expect(result.value).toEqual(
      new NotExistModelError({
        model: 'Requester'
      })
    );
  });

  it('should verify the api key successfully', async () => {
    const result = await sut.execute({
      requester: { apiKey: '5c0dda3563d0' }
    });

    expect(result.value).toEqual({
      requester: {
        id: '7bb55805-faa7-4844-9eba-f1fc9f02812d'
      }
    } as VerifyApiKeyUseCaseDTO.ResultSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
  });
});
