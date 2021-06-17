import { CardMadePublicEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Card } from "../../../models/card";
import { UserProfile } from "../../../models/userProfile";
import { natsWrapper } from "../../../natsWrapper";
import { CardMadePublicListener } from "../publicCardAddedListener";

const id = mongoose.Types.ObjectId();
const userIdFollowing = mongoose.Types.ObjectId().toString();
beforeEach(async () => {
  let followingModel = UserProfile.build({
    id: userIdFollowing,
    username: "following",
  });
  await followingModel.save();
});
const setup = async () => {
  const listener = new CardMadePublicListener(natsWrapper.client);
  const data: CardMadePublicEvent["data"] = {
    id: id.toString(),
    phrase: "test phrase",
    userId: userIdFollowing,
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
it("updates a cards collection and adds a card to the user profile", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const card = await Card.findById(data.id);
  expect(card).toBeDefined();
  expect(card!.phrase).toEqual(data.phrase);
  expect(card!.version).toEqual(data.version - 1);

  const followingDoc = await UserProfile.findOne({
    _id: mongoose.Types.ObjectId(data.userId),
  });
  expect(followingDoc).toBeDefined();
  expect(followingDoc?.cards?.length).toEqual(1);
});
it("acknowleges the nats client", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
