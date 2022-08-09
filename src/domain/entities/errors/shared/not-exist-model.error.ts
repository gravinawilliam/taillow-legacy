import { HttpStatusCode } from '@shared/utils/http-status-code.util';

type ParametersConstructorDTO = {
  model: 'Email domain' | 'Requester' | 'Email template';
};

export class NotExistModelError {
  public statusCode: number;

  public message: string;

  public name: 'NotExistModelError';

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `${parameters.model} does not exist.`;
    this.name = 'NotExistModelError';
    this.statusCode = HttpStatusCode.NOT_FOUND;
  }
}
