import { BaseListener, Subjects, UserFollowedEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { UserProfile } from "../../models/userProfile";
import { queueGroupName } from "../queueGroupName";

export class UserFollowedListener extends BaseListener<UserFollowedEvent> {
  subject: Subjects.UserFollowed = Subjects.UserFollowed;
  queueGroupName = queueGroupName;
  async onMessage(data: UserFollowedEvent["data"], message: Message) {
    const { userIdFollower, userIdFollowing, img, username } = data;
    const userProfileFollowerDoc = await UserProfile.findOne({
      _id: mongoose.Types.ObjectId(userIdFollower),
    });
    await userProfileFollowerDoc?.update({
      $push: { following: mongoose.Types.ObjectId(userIdFollowing) },
    });

    const userProfileFollowingDoc = await UserProfile.findOne({
      _id: mongoose.Types.ObjectId(userIdFollowing),
    });
    await userProfileFollowingDoc?.update({
      $push: { followers: mongoose.Types.ObjectId(userIdFollower) },
    });

    message.ack();
  }
}
