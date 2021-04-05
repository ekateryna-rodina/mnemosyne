import { NotFoundError, RequireAuth } from "@krproj/common";
import express, { NextFunction, Request, Response } from "express";
import { Card } from "../models/card";
import { ISearch } from "../models/search";
const router = express.Router();
router.get(
  "/api/cards/:id",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const cardId = req.params.id;
    try {
      const card = await Card.findById(cardId);
      if (!card) {
        throw new NotFoundError();
      }

      res.status(200).send(card);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/api/cards/",
  // checkSchema({
  //   limit: {
  //     in: ["params", "query"],
  //     errorMessage: "ID is wrong",
  //     isInt: true,
  //     toInt: true,
  //   },
  // }),
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser!.id;
    const { desc, tags, showPublic } = req.query;
    const limit = 10;
    let total;
    let last = req.query.last;
    const tagsList = tags ? (<string>tags).split(",") : [];
    try {
      let cards: ISearch;

      if (!last) {
        const response = await Card.find(
          { userId },
          {},
          { sort: { createdAt: -1 } }
        );
        total = response.length;
        last = response[0]?.id || null;
      }

      const params = {
        ...(tagsList.length > 0 && { tags: { $in: tagsList } }),
        ...(showPublic && {
          $or: [{ userId: userId }, { isPublic: true }],
        }),
        ...(!showPublic && { userId: userId }),
        ...(last && { id: { $gte: last } }),
      };

      if (desc === "true") {
        cards = await Card.find(params)
          .sort({
            createdAt: -1,
          })
          .limit(3);
      } else {
        cards = await Card.find(params).limit(3);
      }
      res.status(200).send(cards);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);
export { router as getCardsRouter };
