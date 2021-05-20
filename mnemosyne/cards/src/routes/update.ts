import {
  BadRequestError,
  NotFoundError,
  RequireAuth,
  validateRequest,
} from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { CardUpdatedEventPublisher } from "../events/publishers/cardUpdatedPublisher";
import { EndRepetitionEventPublisher } from "../events/publishers/endRepetitionPublisher";
import { StartRepetitionEventPublisher } from "../events/publishers/startRepetitionPublisher";
import { Card, ICard } from "../models/card";
import { natsWrapper } from "../natsWrapper";
const router = express.Router();

router.patch(
  "/api/cards/:id",
  [
    body("phrase")
      .isLength({ min: 10, max: 250 })
      .withMessage("Phase should be between 10 and 250 characters"),
    body("tags").notEmpty().withMessage("Please provide at least one tag"),
  ],
  validateRequest,
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const {
      phrase,
      tags,
      keywords,
      deckId,
      image,
      isPublic,
      referenceCards,
      isPriority,
      inRepetition,
    }: ICard = req.body;
    try {
      let card = await Card.findById(id);
      const userId = req.currentUser!.id;
      if (!card) {
        throw new NotFoundError();
      }
      //   do not allow to edit personal card by another user

      if (card.userId != userId) {
        throw new BadRequestError("User id does not match");
      }

      const newCardData = {
        phrase: phrase || card.phrase,
        tags: tags || card.tags,
        keywords: keywords || card.keywords,
        deckId: deckId || card.deckId,
        image: image || card.image,
        isPublic: isPublic || card.isPublic,
        referenceCards: referenceCards || card.referenceCards,
        isPriority: isPriority || card.isPriority,
        userId: card.userId,
      };

      card.set(newCardData);
      await card.save();

      if (card.inRepetition !== inRepetition) {
        if (inRepetition) {
          if (!card.keywords.length && !keywords.length) {
            throw new Error("Not enough params for repetition");
          }
          await new StartRepetitionEventPublisher(natsWrapper.client).publish({
            ...newCardData,
            id: card.id,
            version: card.version,
          });
        } else {
          await new EndRepetitionEventPublisher(natsWrapper.client).publish({
            id: card.id,
            userId: card.userId,
            version: card.version,
          });
        }
      }
      await new CardUpdatedEventPublisher(natsWrapper.client).publish({
        id: card.id,
        phrase: newCardData.phrase,
        userId: newCardData.userId,
        keywords: newCardData.keywords,
        tags: newCardData.tags,
        version: card.version,
      });
      res.status(200).send(card);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as updateCardRouter };
