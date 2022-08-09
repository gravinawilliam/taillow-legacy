import { HttpStatusCode } from '@shared/utils/http-status-code.util';

type ParametersConstructorDTO = {
  error?: Error;
  model:
    | 'email domains'
    | 'email not sent'
    | 'sent email'
    | 'email template'
    | 'email registered in provider'
    | 'requester';
  method: 'save' | 'find';
};

export class RepositoryError {
  public statusCode: number;

  public message: string;

  public name: 'RepositoryError';

  public stack?: string;

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `Error method ${parameters.method} model ${parameters.model} in repository`;
    this.name = 'RepositoryError';
    this.stack = parameters.error?.stack;
    this.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  }
}
