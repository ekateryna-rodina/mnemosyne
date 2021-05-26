import { RepetitionResult, UpdateRepetitionEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Card, ICard } from "../../../models/card";
import { RepetitionHistory } from "../../../models/repetitionHistory";
import { natsWrapper } from "../../../natsWrapper";
import { UpdateRepetitionListener } from "../updateRepetitionListener";
let id = mongoose.Types.ObjectId();
let userId = mongoose.Types.ObjectId().toString();
beforeEach(async () => {
  const body: ICard = {
    id: id.toString(),
    keywords: [{ answer: "Harold Allen Ramis" }],
    phrase:
      "Harold Allen Ramis was an American actor, comedian, director and writer. His best-known film acting roles were as Egon Spengler in Ghostbusters and Ghostbusters II, and as Russell Ziskey in Stripes; ",
    userId,
    isPriority: true,
    tags: ["tag1"],
    version: 0,
    image: "",
  };

  const newCard = Card.build(body);
  await newCard.save();
});
const setup = async () => {
  const listener = new UpdateRepetitionListener(natsWrapper.client);
  const id = mongoose.Types.ObjectId();
  const data: UpdateRepetitionEvent["data"] = {
    repetitionId: mongoose.Types.ObjectId().toString(),
    cardId: id.toString(),
    userId,
    version: 1,
    result: RepetitionResult.Success,
    totalAttempts: 1,
    successfullAttempts: 1,
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("creates new record in repetition history", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const history = await RepetitionHistory.findOne({
    repetitionId: data.repetitionId,
  });
  expect(history).toBeDefined();
  expect(history!.result).toEqual(data.result);
  expect(history!.version).toEqual(data.version);
});
it("acknowleges the nats client", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
