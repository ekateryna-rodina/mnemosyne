import { BadRequestError, RequireAuth } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Follower } from "../models/follower";
const router = express.Router();
router.patch(
  "/api/unfollow/:userId",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //  read user name to follow to (u-1)
      const userToFollowId = req.params.userId;
      const userId = req.currentUser?.id as string;
      // read current user name (u-2)
      let userToFollow = await Follower.findOne({
        _id: mongoose.Types.ObjectId(userToFollowId),
      });

      if (!userToFollow || !userToFollow?.followersIds?.includes(userId)) {
        throw new BadRequestError("Bad request");
      }
      // add user u-1 to following of u-2
      await Follower.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(userId) },
        { $pull: { followingIds: userToFollowId } }
      );
      //  add u-2 to followers of u-1
      await Follower.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(userToFollowId) },
        { $pull: { followersIds: userId } }
      );
      // publish event to inform cards and profile services
      res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

export { router as unfollowRouter };
