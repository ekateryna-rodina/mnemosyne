import { UserFollowedEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Follower } from "../../../models/follower";
import { natsWrapper } from "../../../natsWrapper";
import { UserFollowedListener } from "../userFollowedListener";

const userIdFollowing: string = mongoose.Types.ObjectId().toString();
const userIdFollower: string = mongoose.Types.ObjectId().toString();

beforeEach(async () => {
  let followerModel = Follower.build({
    userId: userIdFollower,
    following: [],
  });
  await followerModel.save();
});
const setup = async () => {
  const listener = new UserFollowedListener(natsWrapper.client);
  const data: UserFollowedEvent["data"] = {
    userIdFollowing,
    userIdFollower,
    username: "follower",
    img: "imageURI",
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};
it("adds to following of the user", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const follower = await Follower.findOne({ userId: userIdFollower });
  expect(follower).toBeDefined();
  expect(follower?.following.length).toEqual(1);
  expect(follower?.following[0].userId).toEqual(userIdFollowing);
});
it("acknowleges the nats client", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
