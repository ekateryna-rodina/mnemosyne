import { RepetitionStatus, StartRepetitionEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Repetition } from "../../../models/repetition";
import { natsWrapper } from "../../../natsWrapper";
import { StartRepetitionListener } from "../startRepetitionListener";
const setup = async () => {
  const listener = new StartRepetitionListener(natsWrapper.client);
  const id = mongoose.Types.ObjectId();
  const data: StartRepetitionEvent["data"] = {
    cardId: id.toString(),
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
it("creates a new repetition", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const repetitions = await Repetition.find({
    cardId: data.cardId,
  }).populate("card");
  const repetition = repetitions[0];
  expect(repetition).toBeDefined();
  expect(repetition!.card.isPriority).toEqual(true);
  expect(repetition!.status).toEqual(RepetitionStatus.Idle);
  expect(repetition!.interval).toEqual(24);
  expect(repetition!.totalAttempts).toEqual(0);
});
it("calls ack on message", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toBeCalled();
});
