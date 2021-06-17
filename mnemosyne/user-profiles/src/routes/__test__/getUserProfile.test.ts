import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";
import { UserProfile } from "../../models/userProfile";
let userId = users[1].id;
const username = "user";
beforeEach(async () => {
  const userProfile = UserProfile.build({
    id: userId,
    username,
    tags: ["history", "math"],
  });

  await userProfile.save();
});
it("gets the user profile by id successfully", async () => {
  let userProfile = await request(app)
    .get(`/api/profile/${userId}`)
    .set("Cookie", global.signin(1))
    .expect(200);
  expect(userProfile.body.username).toEqual(username);
  expect(userProfile.body.tags.length).toEqual(2);
});
it("fails to get user profile", async () => {
  await request(app)
    .get(`/api/profile/${userId}`)
    .set("Cookie", global.signin(2))
    .expect(400);
});
