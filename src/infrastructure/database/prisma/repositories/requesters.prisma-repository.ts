import {
  FindRequestersRepositoryDTO,
  IFindRequestersRepository
} from '@domain/contracts/repositories/requesters/find-requesters.repository';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';

import { prisma } from '@infrastructure/database/prisma/prisma';

import { failure, success } from '@shared/utils/either.util';

export class RequestersPrismaRepository implements IFindRequestersRepository {
  public async find(parameters: FindRequestersRepositoryDTO.Parameters): FindRequestersRepositoryDTO.Result {
    try {
      const result = await prisma.requester.findFirst({
        where: {
          apiKey: parameters.requester.apiKey
        }
      });

      if (result === null) {
        return success({ requester: undefined });
      }

      return success({
        requester: {
          apiKey: result.apiKey,
          id: result.id
        }
      });
    } catch (error: any) {
      return failure(
        new RepositoryError({
          method: 'find',
          model: 'requester',
          error
        })
      );
    }
  }
}
