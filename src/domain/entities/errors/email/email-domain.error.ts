import { HttpStatusCode } from '@shared/utils/http-status-code.util';

type ParametersConstructorDTO = {
  motive: 'does not belong to the requester';
};

export class EmailDomainError {
  public statusCode: number;

  public message: string;

  public name: 'EmailDomainError';

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `Email domain ${parameters.motive}.`;
    this.name = 'EmailDomainError';
    this.statusCode = HttpStatusCode.BAD_REQUEST;
  }
}
