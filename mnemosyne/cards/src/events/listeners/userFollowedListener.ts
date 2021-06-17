import { BaseListener, Subjects, UserFollowedEvent } from "@meproj/common";
import { Message } from "node-nats-streaming";
import { Follower } from "../../models/follower";
import { queueGroupName } from "../queueGroupName";

export class UserFollowedListener extends BaseListener<UserFollowedEvent> {
  subject: Subjects.UserFollowed = Subjects.UserFollowed;
  queueGroupName = queueGroupName;
  async onMessage(data: UserFollowedEvent["data"], message: Message) {
    const { userIdFollower, userIdFollowing, img, username } = data;
    const followerDoc = await Follower.findOne({ userId: userIdFollower });
    followerDoc?.following.push({ userId: userIdFollowing, img, username });
    await followerDoc?.save();

    message.ack();
  }
}
