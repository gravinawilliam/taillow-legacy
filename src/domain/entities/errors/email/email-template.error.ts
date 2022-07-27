import { HttpStatusCode } from '@shared/utils/http-status-code.util';

type ParametersConstructorDTO = {
  motive: 'is not active' | 'is not exist';
};

export class EmailTemplateError {
  public statusCode: number;

  public message: string;

  public name: 'EmailTemplateError';

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `Email template ${parameters.motive}.`;
    this.name = 'EmailTemplateError';
    this.statusCode = HttpStatusCode.BAD_REQUEST;
  }
}
