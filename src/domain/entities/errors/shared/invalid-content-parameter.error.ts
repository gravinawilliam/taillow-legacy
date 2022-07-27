import { HttpStatusCode } from '@shared/utils/http-status-code.util';

type ParametersConstructorDTO = {
  messageDefault?: {
    parameter: string;
    content?: string;
  };
  customMessage?: string;
};

export class InvalidContentParameterError {
  public statusCode: number;

  public message: string;

  public name: 'InvalidContentParameterError';

  constructor(parameters: ParametersConstructorDTO) {
    this.message =
      parameters.customMessage ??
      `Invalid content ${parameters.messageDefault?.content ?? 'is null'} of parameter ${
        parameters.messageDefault?.parameter
      }.`;
    this.name = 'InvalidContentParameterError';
    this.statusCode = HttpStatusCode.BAD_REQUEST;
  }
}
