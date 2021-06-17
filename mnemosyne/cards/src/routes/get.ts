import { NotFoundError, RequireAuth } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import { Card, CardDocument } from "../models/card";
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
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser!.id;
    const { desc, tags, showPublic } = req.query;
    let queryPage: string = req.query.page as string;
    const page: number = queryPage === "" ? 0 : parseInt(queryPage);
    const queryLimit: string = req.query.limit as string;
    const limit: number = queryLimit === "" ? 10 : parseInt(queryLimit);
    // let last = req.query.last;
    const tagsList = tags ? (<string>tags).split(",") : [];
    try {
      const query = {
        ...(tagsList.length > 0 && { tags: { $in: tagsList } }),
        ...(showPublic && {
          $or: [{ userId: userId }, { isPublic: true }],
        }),
        ...(!showPublic && { userId: userId }),
      };
      let sortingOrder = desc === "true" ? -1 : 1;
      const recordsToSkip = page * limit;
      const cards: CardDocument[] = await Card.find(query)
        .sort({
          createdAt: sortingOrder,
        })
        .skip(recordsToSkip)
        .limit(limit);
      const count = await Card.countDocuments(query);
      const paginatedSearchResult: ISearch = {
        cards,
        pager: {
          page: page,
          perPageLimit: limit,
          total: count,
        },
      };
      res.status(200).send(paginatedSearchResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);
export { router as getCardsRouter };
