import mongoose from "mongoose";
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
it("updates the user profile successfully", async () => {
  await request(app)
    .patch(`/api/profile/${userId}`)
    .set("Cookie", global.signin(1))
    .send({ tags: ["history", "math"], image: "imageURI" })
    .expect(200);

  const updatedUserProfile = await UserProfile.findOne({
    _id: mongoose.Types.ObjectId(userId),
  });
  expect(updatedUserProfile?.tags?.length).toEqual(2);
  expect(updatedUserProfile?.image).toEqual("imageURI");
  expect(updatedUserProfile?.username).toEqual("user");
});
it("fails to update the user profile", async () => {
  await request(app)
    .delete(`/api/profile/${userId}`)
    .set("Cookie", global.signin(2))
    .expect(400);

  await request(app)
    .delete(`/api/profile/${mongoose.Types.ObjectId()}`)
    .set("Cookie", global.signin(2))
    .expect(400);
});
