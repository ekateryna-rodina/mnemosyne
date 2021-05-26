import { RepetitionResult } from "@meproj/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";
import { ICard } from "../../models/card";

it("responds with a status to authenticated users and updates fields", async () => {
  await request(app)
    .patch("/api/repetition/:repetitionId")
    .send({})
    .expect(401);
  const userId = users[2].id;
  const body: ICard = {
    id: mongoose.Types.ObjectId().toString(),
    keywords: [{ answer: "Harold Allen Ramis" }],
    phrase:
      "Harold Allen Ramis was an American actor, comedian, director and writer. His best-known film acting roles were as Egon Spengler in Ghostbusters and Ghostbusters II, and as Russell Ziskey in Stripes; ",
    userId,
    isPriority: true,
    tags: ["tag1"],
    version: 2,
  };

  const repetitionResponse = await request(app)
    .post("/api/repetition")
    .send(body)
    .set("Cookie", global.signin(2))
    .expect(201);

  const updatedRepetitionResponse = await request(app)
    .patch(`/api/repetition/${repetitionResponse.body.id}`)
    .send({ cardId: body.id, result: RepetitionResult.Success })
    .set("Cookie", global.signin(2))
    .expect(200);

  expect(updatedRepetitionResponse.body).not.toBeNull();
  expect(updatedRepetitionResponse.body?.totalAttempts).toEqual(
    repetitionResponse.body.totalAttempts + 1
  );
  expect(updatedRepetitionResponse.body?.successfullAttempts).toEqual(
    repetitionResponse.body.successfullAttempts + 1
  );
});
