import {
  ISaveEmailRegisteredInProvidersRepository,
  SaveEmailRegisteredInProvidersRepositoryDTO
} from '@domain/contracts/repositories/email/email-registered-in-providers/save-email-registered-in-providers.repository';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';

import { prisma } from '@infrastructure/database/prisma/prisma';

import { failure, success } from '@shared/utils/either.util';

export class EmailRegisteredInProvidersPrismaRepository implements ISaveEmailRegisteredInProvidersRepository {
  public async save(
    parameters: SaveEmailRegisteredInProvidersRepositoryDTO.Parameters
  ): SaveEmailRegisteredInProvidersRepositoryDTO.Result {
    try {
      await prisma.emailRegisteredInProvider.create({
        data: {
          email: parameters.emailRegisteredInProvider.email.value,
          id: parameters.emailRegisteredInProvider.id,
          providerAwsStatus: parameters.emailRegisteredInProvider.provider.aws.status
        }
      });

      return success(undefined);
    } catch (error: any) {
      return failure(
        new RepositoryError({
          method: 'save',
          model: 'email registered in provider',
          error
        })
      );
    }
  }
}
