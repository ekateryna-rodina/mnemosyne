import { UserUnfollowedEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { UserProfile } from "../../../models/userProfile";
import { natsWrapper } from "../../../natsWrapper";
import { UserUnfollowedListener } from "../userUnfollowedListener";
const userIdFollowing = mongoose.Types.ObjectId().toString();
const userIdFollower = mongoose.Types.ObjectId().toString();
beforeEach(async () => {
  let followingModel = UserProfile.build({
    id: userIdFollowing,
    username: "following",
  });
  await followingModel.save();
  await UserProfile.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(userIdFollowing) },
    { $push: { followers: mongoose.Types.ObjectId(userIdFollower) } }
  );

  let followerModel = UserProfile.build({
    id: userIdFollower,
    username: "follower",
  });
  await followerModel.save();
  await UserProfile.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(userIdFollower) },
    { $push: { following: mongoose.Types.ObjectId(userIdFollowing) } }
  );
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
it("removes from following and followers of both users", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const userProfileFollower = await UserProfile.findOne({
    _id: userIdFollower,
  });
  const userProfileFollowing = await UserProfile.findOne({
    _id: userIdFollowing,
  });
  expect(userProfileFollower).toBeDefined();
  expect(userProfileFollower?.following?.length).toEqual(0);
  expect(userProfileFollowing).toBeDefined();
  expect(userProfileFollowing?.followers?.length).toEqual(0);
});
it("acknowleges the nats client", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
