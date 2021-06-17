import { UserRegisteredEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { UserProfile } from "../../../models/userProfile";
import { natsWrapper } from "../../../natsWrapper";
import { UserRegisteredListener } from "../userRegisteredListener";

const id = mongoose.Types.ObjectId().toString();
const username = "username";
const setup = async () => {
  const listener = new UserRegisteredListener(natsWrapper.client);
  const data: UserRegisteredEvent["data"] = {
    id,
    username,
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};
it("adds new user to user profiles collection", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const profile = await UserProfile.findOne({
    _id: mongoose.Types.ObjectId(id),
  });
  expect(profile).toBeDefined();
  expect(profile?.username).toEqual(username);
});
it("acknowleges the nats client", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
