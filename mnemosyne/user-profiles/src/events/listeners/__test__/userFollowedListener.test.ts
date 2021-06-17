import { UserFollowedEvent } from "@meproj/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { UserProfile } from "../../../models/userProfile";
import { natsWrapper } from "../../../natsWrapper";
import { UserFollowedListener } from "../userFollowedListener";

const userIdFollowing: string = mongoose.Types.ObjectId().toString();
const userIdFollower: string = mongoose.Types.ObjectId().toString();

beforeEach(async () => {
  let userProfileModel1 = UserProfile.build({
    id: userIdFollowing,
    username: "username1",
  });
  await userProfileModel1.save();
  let userProfileModel = UserProfile.build({
    id: userIdFollower,
    username: "username",
  });
  await userProfileModel.save();
});
const setup = async () => {
  const listener = new UserFollowedListener(natsWrapper.client);
  const data: UserFollowedEvent["data"] = {
    userIdFollowing,
    userIdFollower,
    username: "username",
    img: "imageURI",
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};
it("adds to following and followers of both user profiles", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const userProfileFollower = await UserProfile.findOne({
    _id: mongoose.Types.ObjectId(userIdFollower),
  });
  expect(userProfileFollower).toBeDefined();
  expect(userProfileFollower?.following?.length).toEqual(1);

  const userProfileFollowing = await UserProfile.findOne({
    _id: mongoose.Types.ObjectId(userIdFollowing),
  });
  expect(userProfileFollowing).toBeDefined();
  expect(userProfileFollowing?.followers?.length).toEqual(1);
});
it("acknowleges the nats client", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
