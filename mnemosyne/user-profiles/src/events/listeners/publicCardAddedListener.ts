import { BaseListener, CardMadePublicEvent, Subjects } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Card } from "../../models/card";
import { UserProfile } from "../../models/userProfile";
import { queueGroupName } from "../queueGroupName";

export class CardMadePublicListener extends BaseListener<CardMadePublicEvent> {
  subject: Subjects.CardMadePublic = Subjects.CardMadePublic;
  queueGroupName = queueGroupName;
  async onMessage(data: CardMadePublicEvent["data"], message: Message) {
    const { id, phrase, tags, version, image, userId } = data;
    const cardDoc = Card.build({ id, phrase, tags, image, userId });
    await cardDoc.save();

    await UserProfile.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(userId),
      },
      {
        $push: { cards: mongoose.Types.ObjectId(id) },
      },
      { upsert: true }
    );

    message.ack();
  }
}
