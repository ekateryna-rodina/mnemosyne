import { CardUpdatedEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Card, ICard } from "../../../models/card";
import { natsWrapper } from "../../../natsWrapper";
import { UpdateCardListener } from "../updateCardListener";

const id = mongoose.Types.ObjectId();
const userId = mongoose.Types.ObjectId().toString();
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
  const listener = new UpdateCardListener(natsWrapper.client);
  const data: CardUpdatedEvent["data"] = {
    id: id.toString(),
    phrase: "test phrase",
    keywords: [{ answer: "test answer" }],
    userId,
    tags: ["tag1"],
    version: 1,
    isPriority: false,
    image: "",
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};
it("updates a card", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const card = await Card.findById(data.id);
  expect(card).toBeDefined();
  expect(card!.phrase).toEqual(data.phrase);
  expect(card!.version).toEqual(data.version);
});
it("acknowleges the nats client", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
