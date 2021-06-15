import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";
import { Follower } from "../../models/follower";

beforeEach(async () => {
  let user1 = Follower.build({
    id: users[1].id,
    username: "first",
    followingIds: [users[2].id],
  });
  let user2 = Follower.build({
    id: users[2].id,
    username: "second",
    followersIds: [users[1].id, users[3].id],
  });
  let user3 = Follower.build({
    id: users[3].id,
    username: "third",
    followingIds: [users[2].id],
  });
  await Follower.insertMany([user1, user2, user3]);
});
it("listens for patch requests and responds with ok to auth users", async () => {
  await request(app)
    .patch(`/api/unfollow/${mongoose.Types.ObjectId()}`)
    .expect(401);

  await request(app)
    .patch(`/api/unfollow/${users[2].id}`)
    .set("Cookie", global.signin(3))
    .expect(200);
});
it("remove a valid user to follow from collection of following of current user and followers of another user successfully", async () => {
  let follower1;
  let follower2;
  let follower3;
  await request(app)
    .patch(`/api/unfollow/${users[2].id}`)
    .set("Cookie", global.signin(1))
    .expect(200);
  follower1 = await Follower.findById(users[1].id);
  follower2 = await Follower.findById(users[2].id);
  expect(follower1?.followingIds?.length).toEqual(0);
  expect(follower2?.followersIds?.length).toEqual(1);

  await request(app)
    .patch(`/api/unfollow/${users[2].id}`)
    .set("Cookie", global.signin(3))
    .expect(200);
  follower2 = await Follower.findById(users[2].id);
  follower3 = await Follower.findById(users[3].id);
  expect(follower2?.followersIds?.length).toEqual(0);
  expect(follower3?.followingIds?.length).toEqual(0);
});
it("fails to remove followers and following if user does not exist", async () => {
  await request(app)
    .patch(`/api/unfollow/${mongoose.Types.ObjectId()}`)
    .set("Cookie", global.signin(1))
    .expect(400);
});
it("fails to remove followers and following if user is not there already", async () => {
  await request(app)
    .patch(`/api/unfollow/${users[3].id}`)
    .set("Cookie", global.signin(2))
    .expect(400);
});
