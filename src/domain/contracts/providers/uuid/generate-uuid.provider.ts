import { ProviderError } from '@domain/entities/errors/shared/provider.error';

import { Either } from '@shared/utils/either.util';

export namespace GenerateUuidProviderDTO {
  type ResultError = ProviderError;
  type ResultSuccess = { uuid: string };

  export type Result = Either<ResultError, ResultSuccess>;
}

export interface IGenerateUuidProvider {
  generate(): GenerateUuidProviderDTO.Result;
}
