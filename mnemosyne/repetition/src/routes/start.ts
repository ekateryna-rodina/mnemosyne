import {
  NotAuthorizedError,
  RequireAuth,
  validateRequest,
} from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Card } from "../models/card";
import { Repetition } from "../models/repetition";
const router = express.Router();
router.post(
  "/api/repetition",
  [body("phrase").not().isEmpty().withMessage("Card info is required")],
  RequireAuth,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    // validate user and card
    const { id, phrase, keywords, image, userId, isPriority, tags } = req.body;
    try {
      if (userId.toString() !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      // save card
      const cardDoc = Card.build({
        id,
        phrase,
        keywords,
        image,
        userId,
        isPriority,
        tags,
      });

      const newCard = await cardDoc.save();
      // save repetition
      const repetitionDoc = Repetition.build({
        userId,
        card: newCard.id,
      });
      const repetitionInfo = await repetitionDoc.save();
      const newRepInfo = await Repetition.findOne({
        _id: mongoose.Types.ObjectId(repetitionInfo.id),
      }).populate("card");
      res.status(201).send(newRepInfo);
    } catch (error) {
      next(error);
    }
  }
);

export { router as startRepetitionRouter };
