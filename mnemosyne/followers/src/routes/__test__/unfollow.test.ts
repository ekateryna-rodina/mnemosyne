import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
it("listens for post requests", async () => {
  await request(app)
    .post("/api/unfollow/")
    .send({ userId: mongoose.Types.ObjectId() })
    .expect(401);

  await request(app)
    .post("/api/unfollow/")
    .set("Cookie", global.signin(3))
    .send({ userId: mongoose.Types.ObjectId() })
    .expect(200);
});
