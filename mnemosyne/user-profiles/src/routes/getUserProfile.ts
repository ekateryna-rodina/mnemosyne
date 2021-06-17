import { BadRequestError, RequireAuth } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { UserProfile } from "../models/userProfile";
const router = express.Router();
router.get(
  "/api/profile/:userId",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.currentUser!.id;
    const profileToGet = req.params.userId;
    try {
      if (currentUser !== profileToGet) {
        throw new BadRequestError("Bad request");
      }

      const userProfile = await UserProfile.findOne({
        _id: mongoose.Types.ObjectId(profileToGet),
      });
      res.status(200).send(userProfile);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getUserProfileRouter };
