import { RepetitionResult, UpdateRepetitionEvent } from "@meproj/common";
import moment from "moment";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Card, ICard } from "../../../models/card";
import { Repetition } from "../../../models/repetition";
import { natsWrapper } from "../../../natsWrapper";
import { UpdateRepetitionListener } from "../updateRepetitionListener";
let id: string;
let userId = mongoose.Types.ObjectId().toString();
beforeEach(async () => {
  id = mongoose.Types.ObjectId().toString();
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

  const card = Card.build(body);
  await card.save();
  const repetition = Repetition.build({
    id: mongoose.Types.ObjectId().toString(),
    cardId: card._id.toString(),
    card,
    userId,
    version: 0,
  });
  await repetition.save();
});
const setup = async () => {
  const listener = new UpdateRepetitionListener(natsWrapper.client);
  const data: UpdateRepetitionEvent["data"] = {
    repetitionId: mongoose.Types.ObjectId().toString(),
    cardId: id,
    userId,
    version: 1,
    result: RepetitionResult.Success,
    totalAttempts: 1,
    successfullAttempts: 1,
    nextRepetition: moment().add(48, "hours").toISOString(),
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("updates a repetition", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const repetition = await Repetition.findOne({
    cardId: data.cardId,
  });
  expect(repetition).toBeDefined();
  expect(repetition!.nextRepetition).toBeDefined();
});
it("acknowleges the nats client", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
