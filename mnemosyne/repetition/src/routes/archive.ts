import { NotAuthorizedError, RequireAuth } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Repetition } from "../models/repetition";
const router = express.Router();

router.delete(
  "/api/repetition/:repetitionId",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser!.id;
    const repetitionId: string =
      req.params.repetitionId ?? req.query.repetitionId;
    try {
      const repetition = await Repetition.findById(repetitionId);
      if (repetition?.userId !== userId) {
        throw new NotAuthorizedError();
      }

      await Repetition.updateOne(
        { _id: mongoose.Types.ObjectId(repetition?.id) },
        {
          $set: { isArchived: true },
        }
      );
      res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

export { router as archiveRepetitionRouter };
