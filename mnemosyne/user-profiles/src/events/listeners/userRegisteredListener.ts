import { BaseListener, Subjects, UserRegisteredEvent } from "@meproj/common";
import { Message } from "node-nats-streaming";
import { UserProfile } from "../../models/userProfile";
import { queueGroupName } from "../queueGroupName";

export class UserRegisteredListener extends BaseListener<UserRegisteredEvent> {
  subject: Subjects.UserRegistered = Subjects.UserRegistered;
  queueGroupName = queueGroupName;
  async onMessage(data: UserRegisteredEvent["data"], message: Message) {
    const { id, username } = data;

    const userProfileDoc = UserProfile.build({
      id,
      username,
    });

    await userProfileDoc.save();

    message.ack();
  }
}
