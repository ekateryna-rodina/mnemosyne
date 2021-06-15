import { BadRequestError, RequireAuth } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { UserFollowedEventPublisher } from "../events/publishers/userFollowedPublisher";
import { Follower } from "../models/follower";
import { natsWrapper } from "../natsWrapper";
const router = express.Router();
router.patch(
  "/api/follow/:userId",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //  read user name to follow to (u-1)
      const userIdToFollow = req.params.userId;
      const userId = req.currentUser?.id as string;
      // read current user name (u-2)
      let userToFollow = await Follower.findOne({
        _id: mongoose.Types.ObjectId(userIdToFollow),
      });

      if (!userToFollow || userToFollow?.followersIds?.includes(userId)) {
        throw new BadRequestError("Bad request");
      }
      // add user u-1 to following of u-2
      await Follower.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(userId) },
        { $push: { followingIds: userIdToFollow } },
        { upsert: true }
      );
      //  add u-2 to followers of u-1
      await Follower.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(userIdToFollow) },
        { $push: { followersIds: userId } },
        { upsert: true }
      );
      // publish event to inform cards and profile services
      await new UserFollowedEventPublisher(natsWrapper.client).publish({
        id: userId,
        userIdToFollow: userIdToFollow,
      });
      res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

export { router as followRouter };
