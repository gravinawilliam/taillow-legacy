import { ProviderError } from '@domain/entities/errors/shared/provider.error';

import { Either } from '@shared/utils/either.util';

export namespace AddVariablesInEmailTemplateProviderDTO {
  export type Parameters = {
    htmlEmailTemplate: string;
    variables: {
      [key: string]: string;
    };
  };

  export type ResultError = ProviderError;
  type ResultSuccess = {
    html: string;
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IAddVariablesInEmailTemplateProvider {
  addVariablesInEmailTemplate(
    parameters: AddVariablesInEmailTemplateProviderDTO.Parameters
  ): AddVariablesInEmailTemplateProviderDTO.Result;
}
