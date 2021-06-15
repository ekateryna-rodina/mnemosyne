import { BaseListener, Subjects, UserRegisteredEvent } from "@meproj/common";
import { Message } from "node-nats-streaming";
import { Follower } from "../../models/follower";
import { queueGroupName } from "../queueGroupName";

export class UserRegisteredListener extends BaseListener<UserRegisteredEvent> {
  subject: Subjects.UserRegistered = Subjects.UserRegistered;
  queueGroupName = queueGroupName;
  async onMessage(data: UserRegisteredEvent["data"], message: Message) {
    const { id, username } = data;

    const followerDoc = Follower.build({
      id,
      username,
    });

    await followerDoc.save();

    message.ack();
  }
}
