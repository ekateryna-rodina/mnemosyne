import { StartRepetitionEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Card } from "../../../models/card";
import { Repetition } from "../../../models/repetition";
import { natsWrapper } from "../../../natsWrapper";
import { StartRepetitionListener } from "../startRepetitionListener";
let cardId;
let repetitionId;
const setup = async () => {
  cardId = mongoose.Types.ObjectId().toString();
  repetitionId = mongoose.Types.ObjectId().toString();
  const listener = new StartRepetitionListener(natsWrapper.client);

  const data: StartRepetitionEvent["data"] = {
    repetitionId,
    cardId,
    keywords: [{ answer: "Harold Allen Ramis" }],
    phrase:
      "Harold Allen Ramis was an American actor, comedian, director and writer. His best-known film acting roles were as Egon Spengler in Ghostbusters and Ghostbusters II, and as Russell Ziskey in Stripes; ",
    userId: mongoose.Types.ObjectId().toString(),
    isPriority: true,
    tags: ["tag1"],
    version: 1,
    image: "",
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};
it("creates a new card and repetition", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const card = await Card.findOne({
    _id: data.cardId,
  });

  expect(card).toBeDefined();
  expect(card!.isPriority).toEqual(data.isPriority);
  expect(card!.phrase).toEqual(data.phrase);
  expect(card!.version).toEqual(data.version - 1);

  const repetition = await Repetition.findOne({ cardId: data.cardId });
  expect(repetition).toBeDefined();
  expect(repetition!.interval).toEqual(24);
  expect(repetition!.totalAttempts).toEqual(0);
});

it("calls ack on message", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toBeCalled();
});
