import { EndRepetitionEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Card } from "../../../models/card";
import { Repetition } from "../../../models/repetition";
import { natsWrapper } from "../../../natsWrapper";
import { EndRepetitionListener } from "../endRepetitionListener";
const userId = mongoose.Types.ObjectId();
let cardId: string;
beforeEach(async () => {
  const cardDoc = Card.build({
    id: mongoose.Types.ObjectId().toString(),
    phrase: "test phrase",
    keywords: [],
    userId: userId.toHexString(),
    isPriority: false,
    tags: ["tag1"],
    version: 0,
  });
  const newCard = await cardDoc.save();
  const repetitionDoc = Repetition.build({
    userId: userId.toHexString(),
    card: newCard.id,
    cardId: cardDoc.id,
    version: 0,
  });

  const savedRepetition = await repetitionDoc.save();
  cardId = newCard.id;
});
const setup = async () => {
  const listener = new EndRepetitionListener(natsWrapper.client);
  const data: EndRepetitionEvent["data"] = {
    cardId,
    version: 1,
    userId: userId.toHexString(),
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};
it("updates repetition to be archived", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const repetition = await Repetition.findOne({ cardId: data.cardId });
  expect(repetition!.isArchived).toEqual(true);
});
it("calls ack on message", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toBeCalled();
});
