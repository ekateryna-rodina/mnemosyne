import {
  BadRequestError,
  NotAuthorizedError,
  RepetitionResult,
  RequireAuth,
} from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import moment from "moment";
import mongoose from "mongoose";
import { RepetitionUpdatedEventPublisher } from "../events/publishers/repetitionUpdatedPublisher";
import { Card } from "../models/card";
import { Repetition, RepetitionDocument } from "../models/repetition";
import { natsWrapper } from "../natsWrapper";
const router = express.Router();
router.patch(
  "/api/repetition/:repetitionId",
  [
    body("cardId").not().isEmpty().withMessage("Card id is required on update"),
    body("result")
      .not()
      .isEmpty()
      .withMessage("Result id is required on update"),
  ],
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const repetitionId: string =
      req.params.repetitionId ?? req.query.repetitionId;
    const userId = req.currentUser!.id;
    const { result, cardId } = req.body;
    let repetition: RepetitionDocument | null;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new BadRequestError("Bad request");
    }
    try {
      if (card.userId.toString() !== userId) {
        throw new NotAuthorizedError();
      }
      repetition = await Repetition.findById(repetitionId);
      const {
        id,
        interval,
        totalAttempts,
        successfullAttempts,
        nextRepetition,
        cardId,
      } = repetition!;
      const newIntervel =
        result == RepetitionResult.Success ? interval * 1.5 : 24;
      const newTotal = totalAttempts + 1;
      const newSuccessfull =
        result == RepetitionResult.Success
          ? successfullAttempts + 1
          : successfullAttempts;
      const newNextRepetition = moment().add(newIntervel, "hours");
      await Repetition.updateOne(
        { _id: mongoose.Types.ObjectId(repetition?.id) },
        {
          $set: {
            interval: newIntervel,
            totalAttempts: newTotal,
            successfullAttempts: newSuccessfull,
            nextRepetition: newNextRepetition.toISOString(),
          },
        }
      );
      const updatedRepetition = await Repetition.findOne({
        _id: mongoose.Types.ObjectId(repetition?.id),
      }).populate("card");

      await new RepetitionUpdatedEventPublisher(natsWrapper.client).publish({
        repetitionId,
        result,
        totalAttempts: newTotal,
        successfullAttempts: newSuccessfull,
        userId,
        cardId,
        nextRepetition: newNextRepetition.toISOString(),
        version: updatedRepetition!.version,
      });

      res.status(200).send(updatedRepetition);
    } catch (error) {}
  }
);

export { router as updateRepetitionRouter };
