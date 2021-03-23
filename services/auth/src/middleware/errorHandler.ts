import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serialize() });
  }

  res.status(500).send({ errors: [{ message: err.message }] });
};
