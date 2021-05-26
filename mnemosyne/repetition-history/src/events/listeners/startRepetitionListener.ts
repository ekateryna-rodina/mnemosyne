import { BaseListener, StartRepetitionEvent, Subjects } from "@meproj/common";
import { Message } from "node-nats-streaming";
import { Card } from "../../models/card";
import { queueGroupName } from "../queueGroupName";

export class StartRepetitionListener extends BaseListener<StartRepetitionEvent> {
  subject: Subjects.RepetitionStarted = Subjects.RepetitionStarted;
  queueGroupName = queueGroupName;
  async onMessage(data: StartRepetitionEvent["data"], message: Message) {
    // validate user and card
    const {
      cardId,
      phrase,
      keywords,
      image,
      userId,
      isPriority,
      tags,
      version,
    } = data;

    // save card to local database on repetition start
    const cardDoc = Card.build({
      id: cardId,
      phrase,
      keywords,
      image,
      userId,
      isPriority,
      tags,
      version,
    });

    await cardDoc.save();
    message.ack();
  }
}
