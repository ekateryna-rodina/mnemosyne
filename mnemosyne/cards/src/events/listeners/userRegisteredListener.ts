import { BaseListener, Subjects, UserRegisteredEvent } from "@meproj/common";
import { Message } from "node-nats-streaming";
import { Follower } from "../../models/follower";
import { queueGroupName } from "../queueGroupName";

export class UserRegisteredListener extends BaseListener<UserRegisteredEvent> {
  subject: Subjects.UserRegistered = Subjects.UserRegistered;
  queueGroupName = queueGroupName;
  async onMessage(data: UserRegisteredEvent["data"], message: Message) {
    const { id } = data;
    const followerDoc = Follower.build({ userId: id, following: [] });
    await followerDoc?.save();

    message.ack();
  }
}
