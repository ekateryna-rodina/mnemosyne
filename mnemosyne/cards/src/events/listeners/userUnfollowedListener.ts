import { BaseListener, Subjects, UserUnfollowedEvent } from "@meproj/common";
import { Message } from "node-nats-streaming";
import { Follower } from "../../models/follower";
import { queueGroupName } from "../queueGroupName";

export class UserUnfollowedListener extends BaseListener<UserUnfollowedEvent> {
  subject: Subjects.UserUnfollowed = Subjects.UserUnfollowed;
  queueGroupName = queueGroupName;
  async onMessage(data: UserUnfollowedEvent["data"], message: Message) {
    const { userIdFollower, userIdFollowing } = data;
    const followerDoc = await Follower.findOne({ userId: userIdFollower });
    await followerDoc?.update({
      $pull: { following: { userId: userIdFollowing } },
    });
    await followerDoc?.save();

    message.ack();
  }
}
