import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
  constructor() {
    super("Resource does not exist");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  statusCode = 404;
  serialize() {
    return [
      {
        message: "Resource does not exist",
      },
    ];
  }
}
