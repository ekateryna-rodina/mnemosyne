import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";
import { ICard } from "../../models/card";
import { Repetition } from "../../models/repetition";

it("archieves the repetition", async () => {
  const userId = users[1].id;
  const body: ICard = {
    id: mongoose.Types.ObjectId().toString(),
    keywords: [{ answer: "ji" }],
    phrase: "anyphrase",
    userId,
    tags: ["tag"],
  };

  const repetitionResponse = await request(app)
    .post("/api/repetition")
    .send(body)
    .set("Cookie", global.signin(1))
    .expect(201);

  await request(app)
    .delete(`/api/repetition/${repetitionResponse.body.id}`)
    .set("Cookie", global.signin(2))
    .expect(401);

  await request(app)
    .delete(`/api/repetition/${repetitionResponse.body.id}`)
    .set("Cookie", global.signin(1))
    .expect(200);

  const repetition = await Repetition.findById(repetitionResponse.body.id);
  expect(repetition!.isArchived).toEqual(true);
});
