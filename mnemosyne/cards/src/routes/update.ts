import {
  BadRequestError,
  NotFoundError,
  RequireAuth,
  validateRequest,
} from "@krproj/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Card, ICard } from "../models/card";
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
    }: ICard = req.body;
    try {
      let card = await Card.findById(id);
      if (!card) {
        throw new NotFoundError();
      }
      //   do not allow to edit personal card by another user

      if (card.userId != req.currentUser!.id) {
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
        userId: card.userId,
      };
      const updatedCard = await Card.findByIdAndUpdate(id, newCardData, {
        new: true,
      });
      res.status(200).send(updatedCard);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as updateCardRouter };
