import { HttpStatusCode } from '@shared/utils/http-status-code.util';

type ParametersConstructorDTO = {
  error?: Error;
  provider: string;
  method: string;
};

export class ProviderError {
  public statusCode: number;

  public message: string;

  public name: 'ProviderError';

  public stack?: string;

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `Error method ${parameters.method} provider ${parameters.provider} in provider`;
    this.name = 'ProviderError';
    this.stack = parameters.error?.stack;
    this.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  }
}
