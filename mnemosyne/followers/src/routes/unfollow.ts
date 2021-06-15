import { RequireAuth } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
router.post(
  "/api/unfollow",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({});
  }
);

export { router as unfollowRouter };
