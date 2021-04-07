import { CustomError } from "./customError";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serialize() {
    return [{ message: this.message }];
  }
}
