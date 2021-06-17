import { BadRequestError, RequireAuth } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { UserProfile } from "../models/userProfile";
const router = express.Router();
router.delete(
  "/api/profile/:userId",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.currentUser!.id;
    const profileToDelete = req.params.userId;
    try {
      if (currentUser !== profileToDelete) {
        throw new BadRequestError("Bad request");
      }

      await UserProfile.findOneAndDelete({
        _id: mongoose.Types.ObjectId(profileToDelete),
      });
      res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteUserProfileRouter };
