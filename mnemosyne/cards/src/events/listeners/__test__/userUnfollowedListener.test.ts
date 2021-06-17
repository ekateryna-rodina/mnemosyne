import { UserUnfollowedEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Follower } from "../../../models/follower";
import { natsWrapper } from "../../../natsWrapper";
import { UserUnfollowedListener } from "../userUnfollowedListener";
const userIdFollowing = mongoose.Types.ObjectId().toString();
const userIdFollower = mongoose.Types.ObjectId().toString();
beforeEach(async () => {
  let followerModel = Follower.build({
    userId: userIdFollower,
    following: [{ userId: userIdFollowing, img: "image", username: "user" }],
  });
  await followerModel.save();
});
const setup = async () => {
  const listener = new UserUnfollowedListener(natsWrapper.client);
  const data: UserUnfollowedEvent["data"] = {
    userIdFollowing,
    userIdFollower,
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};
it("removes from following of the user", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const follower = await Follower.findOne({
    userId: userIdFollower,
  });
  expect(follower).toBeDefined();
  expect(follower?.following.length).toEqual(0);
});
it("acknowleges the nats client", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
