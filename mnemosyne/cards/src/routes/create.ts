import { RequireAuth, validateRequest } from "@krproj/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Card } from "../models/card";
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
    const { phrase, tags, keywords, isPublic } = req.body;
    try {
      const card = Card.build({
        phrase,
        tags,
        keywords,
        isPublic,
        userId: req.currentUser!.id,
      });

      await card.save();
      res.status(201).send(card);
    } catch (error) {
      next(error);
    }
  }
);

export { router as createCardsRouter };
