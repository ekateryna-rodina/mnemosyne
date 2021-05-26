import { BaseListener, CardUpdatedEvent, Subjects } from "@meproj/common";
import { Message } from "node-nats-streaming";
import { Card } from "../../models/card";
import { queueGroupName } from "../queueGroupName";

export class UpdateCardListener extends BaseListener<CardUpdatedEvent> {
  subject: Subjects.CardUpdated = Subjects.CardUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: CardUpdatedEvent["data"], message: Message) {
    const { id, phrase, keywords, tags, isPublic, version, image, isPriority } =
      data;
    console.log(`id ${id} version ${version}`);
    const card = await Card.findByIdAndPreVersion({ id, version });
    if (!card) throw new Error("Card is not found");
    card.set({ phrase, keywords, tags, isPublic, image, isPriority });
    await card.save();
    message.ack();
  }
}
