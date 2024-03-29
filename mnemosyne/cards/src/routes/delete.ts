import { BadRequestError, RequireAuth } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import { CardDeletedEventPublisher } from "../events/publishers/cardDeletedPublisher";
import { Card } from "../models/card";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

router.delete(
  "/api/cards/:id",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const cardId = req.params.id;
    const userId = req.currentUser!.id;
    try {
      const card = await Card.findById(cardId);
      if (!card) {
        throw new BadRequestError("Card does not exist");
      }
      if (card.userId != userId) {
        throw new BadRequestError("User id does not match");
      }

      await card.remove();
      await new CardDeletedEventPublisher(natsWrapper.client).publish({
        id: card.id,
        userId: card.userId,
        version: card.version,
      });

      res.status(200).send({});
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as deleteCardRouter };
