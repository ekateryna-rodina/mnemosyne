import { CustomError } from "./customError";

export class DatabaseConnectionError extends CustomError {
  statusCode = 503;
  reason = "Error connection to database";
  constructor() {
    super("Error connection to database");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serialize() {
    return [{ message: this.reason }];
  }
}
