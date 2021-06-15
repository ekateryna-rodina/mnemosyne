import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";
import { Follower } from "../../models/follower";
// user;
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
it("listens for post requests and responds with ok to auth users", async () => {
  await request(app)
    .post("/api/follow/")
    .send({ userId: mongoose.Types.ObjectId() })
    .expect(401);

  await request(app)
    .post("/api/follow/")
    .set("Cookie", global.signin(3))
    .send({ userId: mongoose.Types.ObjectId() })
    .expect(200);
});
it("adds a valid user to follow to collection of following of current user", async () => {
  let follower1 = await Follower.findById(users[1].id);
  let follower2 = await Follower.findById(users[2].id);
  await request(app)
    .post("/api/follow/")
    .set("Cookie", global.signin(1))
    .send({ userId: follower2 })
    .expect(200);
  expect(follower2?.followers?.length).toEqual(2);
});
it("adds current user as a follower to another user", async () => {
  let follower2 = await Follower.findById(users[2].id);
  expect(follower2?.followers?.length).toEqual(2);
});
