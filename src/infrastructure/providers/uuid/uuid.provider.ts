import * as uuid from 'uuid';

import {
  GenerateUuidProviderDTO,
  IGenerateUuidProvider
} from '@domain/contracts/providers/uuid/generate-uuid.provider';
import { ProviderError } from '@domain/entities/errors/shared/provider.error';

import { failure, success } from '@shared/utils/either.util';

export class UuidProvider implements IGenerateUuidProvider {
  public generate(): GenerateUuidProviderDTO.Result {
    try {
      const generatedUuid = uuid.v4();
      return success({
        uuid: generatedUuid
      });
    } catch (error: any) {
      return failure(
        new ProviderError({
          method: 'generate',
          provider: 'uuid',
          error
        })
      );
    }
  }
}
