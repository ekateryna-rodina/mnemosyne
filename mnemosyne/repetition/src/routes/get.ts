import { RequireAuth } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import { Repetition } from "../models/repetition";
const router = express.Router();

router.get(
  "/api/repetition",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser!.id;
    try {
      const repetitions = await Repetition.find({ userId });
      console.log(repetitions);
      res.status(200).send(repetitions);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getRepetitionRouter };
