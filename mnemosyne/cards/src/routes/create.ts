import { RequireAuth, validateRequest } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { CardCreatedEventPublisher } from "../events/publishers/cardCreatedPublisher";
import { Card, ICard } from "../models/card";
import { natsWrapper } from "../natsWrapper";
const router = express.Router();

router.post(
  "/api/cards",
  [
    body("phrase")
      .isLength({ min: 10, max: 250 })
      .withMessage("Phase should be between 10 and 250 characters"),
    body("phrase").not().isEmpty().withMessage("Phrase cannot be empty"),
    body("tags")
      .isArray({ min: 1 })
      .withMessage("Please provide at least one tag"),
  ],
  validateRequest,
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { phrase, tags, keywords, isPublic, inRepetition }: ICard = req.body;
    try {
      const card = Card.build({
        phrase,
        tags,
        keywords,
        isPublic,
        userId: req.currentUser!.id,
        inRepetition,
      });

      await card.save();

      await new CardCreatedEventPublisher(natsWrapper.client).publish({
        id: card.id,
        phrase: card.phrase,
        userId: card.userId,
        keywords: card.keywords,
        tags: card.tags,
        version: card.version,
      });
      res.status(201).send(card);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as createCardsRouter };
