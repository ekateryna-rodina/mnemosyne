import { BaseListener, Subjects, UserUnfollowedEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { UserProfile } from "../../models/userProfile";
import { queueGroupName } from "../queueGroupName";

export class UserUnfollowedListener extends BaseListener<UserUnfollowedEvent> {
  subject: Subjects.UserUnfollowed = Subjects.UserUnfollowed;
  queueGroupName = queueGroupName;
  async onMessage(data: UserUnfollowedEvent["data"], message: Message) {
    const { userIdFollower, userIdFollowing } = data;
    const followerDoc = await UserProfile.findOne({ _id: userIdFollower });
    await followerDoc?.update({
      $pull: { following: mongoose.Types.ObjectId(userIdFollowing) },
    });

    const followingDoc = await UserProfile.findOne({ _id: userIdFollowing });
    await followingDoc?.update({
      $pull: { followers: mongoose.Types.ObjectId(userIdFollower) },
    });

    message.ack();
  }
}
