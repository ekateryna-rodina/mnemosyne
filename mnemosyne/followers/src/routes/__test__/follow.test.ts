import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";
import { Follower } from "../../models/follower";

beforeEach(async () => {
  let user1 = Follower.build({
    id: users[1].id,
    username: "first",
  });
  let user2 = Follower.build({
    id: users[2].id,
    username: "second",
  });
  let user3 = Follower.build({
    id: users[3].id,
    username: "third",
  });
  await Follower.insertMany([user1, user2, user3]);
});
it("listens for patch requests and responds with ok to auth users", async () => {
  await request(app)
    .patch(`/api/follow/${mongoose.Types.ObjectId()}`)
    .expect(401);

  await request(app)
    .patch(`/api/follow/${users[2].id}`)
    .set("Cookie", global.signin(3))
    .expect(200);
});
it("adds a valid user to follow to collection of following of current user and populates followers of another user successfully", async () => {
  let follower1;
  let follower2;
  let follower3;
  await request(app)
    .patch(`/api/follow/${users[2].id}`)
    .set("Cookie", global.signin(1))
    .expect(200);
  follower1 = await Follower.findById(users[1].id);
  follower2 = await Follower.findById(users[2].id);
  expect(follower1?.followingIds?.length).toEqual(1);
  expect(follower2?.followersIds?.length).toEqual(1);

  await request(app)
    .patch(`/api/follow/${users[2].id}`)
    .set("Cookie", global.signin(3))
    .expect(200);
  follower2 = await Follower.findById(users[2].id);
  follower3 = await Follower.findById(users[3].id);
  expect(follower2?.followersIds?.length).toEqual(2);
  expect(follower3?.followingIds?.length).toEqual(1);
});
it("fails to add followers and following if user does not exist", async () => {
  await request(app)
    .patch(`/api/follow/${mongoose.Types.ObjectId()}`)
    .set("Cookie", global.signin(1))
    .expect(400);
});
it("fails to add followers and following if user is added already", async () => {
  await request(app)
    .patch(`/api/follow/${users[2].id}`)
    .set("Cookie", global.signin(3))
    .expect(200);
  await request(app)
    .patch(`/api/follow/${users[2].id}`)
    .set("Cookie", global.signin(3))
    .expect(400);
});
