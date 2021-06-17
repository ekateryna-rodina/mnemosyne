import { UserRegisteredEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Follower } from "../../../models/follower";
import { natsWrapper } from "../../../natsWrapper";
import { UserRegisteredListener } from "../userRegisteredListener";

const userIdFollowing: string = mongoose.Types.ObjectId().toString();
const userIdFollower: string = mongoose.Types.ObjectId().toString();

const setup = async () => {
  const listener = new UserRegisteredListener(natsWrapper.client);
  const data: UserRegisteredEvent["data"] = {
    id: userIdFollower,
    username: "newuser",
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};
it("adds new user to followers collection", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const follower = await Follower.findOne({ userId: userIdFollower });
  expect(follower).toBeDefined();
  expect(follower?.following.length).toEqual(0);
});
it("acknowleges the nats client", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
