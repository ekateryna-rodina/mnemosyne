import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/notAuthorizedError";

export const RequireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
