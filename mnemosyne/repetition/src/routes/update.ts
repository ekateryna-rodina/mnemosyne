import {
  BadRequestError,
  NotAuthorizedError,
  RepetitionResult,
  RequireAuth,
} from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Card } from "../models/card";
import { Repetition, RepetitionDocument } from "../models/repetition";
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
    console.log(repetitionId);
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
      } = repetition!;
      const newIntervel =
        result == RepetitionResult.Success ? interval * 1.5 : 24;
      const newTotal = totalAttempts + 1;
      const newSuccessfull =
        result == RepetitionResult.Success
          ? successfullAttempts + 1
          : successfullAttempts;
      const currentDate = new Date().getUTCDate();
      const newNextRepetition = new Date().setUTCHours(
        currentDate + newIntervel
      );
      //TODO: implement history repetition service
      // The role - save date, result, card
      // Current repetition is updated, no new document is created
      const response = await Repetition.updateOne(
        { _id: mongoose.Types.ObjectId(repetition?.id) },
        {
          $set: {
            interval: newIntervel,
            totalAttempts: newTotal,
            successfullAttempts: newSuccessfull,
            nextRepetition: newNextRepetition.toString(),
          },
        }
      );
      const updatedRepetition = await Repetition.findOne({
        _id: mongoose.Types.ObjectId(repetition?.id),
      }).populate("card");

      res.status(200).send(updatedRepetition);
    } catch (error) {}
  }
);
// router.patch(
//   "/api/repetition/:repetitionId",
//   [
//     body("cardId").not().isEmpty().withMessage("Card id is required on update"),
//     body("status")
//       .not()
//       .isEmpty()
//       .withMessage("Result id is required on update"),
//   ],
//   RequireAuth,
//   async (req: Request, res: Response, next: NextFunction) => {
//     const repetitionId: string = req.query.cardId as string;
//     const userId = req.currentUser!.id;
//     const { status, cardId } = req.body;
//     let repetition: RepetitionDocument;
//     try {
//       const card = await Card.findById(cardId);
//       if (!card) {
//         throw new BadRequestError("Bad request");
//       }

//       if (card.userId.toString() !== userId) {
//         throw new NotAuthorizedError();
//       }
//       const repetition = await Repetition.findOne({
//         cardId: mongoose.Types.ObjectId(cardId),
//       });
//       if (!repetition) {
//         // create new repetition
//       }
//       const {
//         id,
//         interval,
//         totalAttempts,
//         successfullAttempts,
//         nextRepetition,
//       } = repetition!;

//       const newIntervel = interval * 1.5;
//       const newTotal = totalAttempts + 1;
//       const newSuccessfull =
//         status == RepetitionResult.Success
//           ? successfullAttempts + 1
//           : successfullAttempts;
//       const currentDate = new Date().getUTCDate();
//       const newNextRepetition = new Date().setUTCHours(
//         currentDate + newIntervel
//       );

//       const response = await Repetition.updateOne(
//         { _id: mongoose.Types.ObjectId(repetition?.id) },
//         {
//           $set: {
//             interval: newIntervel,
//             totalAttempts: newTotal,
//             successfullAttempts: newSuccessfull,
//             nextRepetition: newNextRepetition.toString(),
//           },
//         }
//       );
//       res.status(200).send(response);
//     } catch (error) {}
//   }
// );

export { router as updateRepetitionRouter };
