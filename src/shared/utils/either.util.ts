export type Either<F, S> = Failure<F, S> | Success<F, S>;

export class Failure<F, S> {
  readonly value: F;

  constructor(parameters: F) {
    this.value = parameters;
  }

  isFailure(): this is Failure<F, S> {
    return true;
  }

  isSuccess(): this is Success<F, S> {
    return false;
  }
}

export class Success<F, S> {
  readonly value: S;

  constructor(parameters: S) {
    this.value = parameters;
  }

  isFailure(): this is Failure<F, S> {
    return false;
  }

  isSuccess(): this is Success<F, S> {
    return true;
  }
}

export const failure = <F, S>(parameters: F): Either<F, S> => {
  return new Failure<F, S>(parameters);
};

export const success = <F, S>(parameters: S): Either<F, S> => {
  return new Success<F, S>(parameters);
};
