import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";
import { UserProfile } from "../../models/userProfile";
let userId = users[1].id;
beforeEach(async () => {
  const userProfile = UserProfile.build({
    id: userId,
    username: "user",
  });

  await userProfile.save();
});
it("deletes the user profile successfully", async () => {
  await request(app)
    .delete(`/api/profile/${userId}`)
    .set("Cookie", global.signin(1))
    .expect(200);
});
it("fails to delete user profile", async () => {
  await request(app)
    .delete(`/api/profile/${userId}`)
    .set("Cookie", global.signin(2))
    .expect(400);
});
