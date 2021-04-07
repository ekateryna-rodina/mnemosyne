import { CustomError } from "./customError";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super("User is not authorized");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serialize() {
    return [{ message: "User is not authorized" }];
  }
}
