import { RepetitionStatus } from "@meproj/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";
import { ICard } from "../../models/card";

let body: ICard;

beforeEach(() => {
  const id = mongoose.Types.ObjectId();
  body = {
    id: id.toString(),
    keywords: [{ answer: "Harold Allen Ramis" }],
    phrase:
      "Harold Allen Ramis was an American actor, comedian, director and writer. His best-known film acting roles were as Egon Spengler in Ghostbusters and Ghostbusters II, and as Russell Ziskey in Stripes; ",
    userId: "",
    isPriority: true,
    tags: ["tag1"],
  };
});
it("listens to start repetition request and answer with 201 to authenticated user", async () => {
  const userId = users[1].id;
  await request(app)
    .post("/api/repetition")
    .send({ ...body, userId })
    .set("Cookie", global.signin(1))
    .expect(201);

  await request(app).post("/api/repetition").send(body).expect(401);
});

it("fails if user ids do not match", async () => {
  await request(app)
    .post("/api/repetition")
    .send({ ...body, userId: users[2].id })
    .set("Cookie", global.signin(1))
    .expect(401);

  await request(app)
    .post("/api/repetition")
    .send({ ...body, userId: users[2].id })
    .set("Cookie", global.signin(2))
    .expect(201);
});

it("fails if phrase is not provided", async () => {
  await request(app)
    .post("/api/repetition")
    .send({ ...body, phrase: null, userId: users[2].id })
    .set("Cookie", global.signin(2))
    .expect(400);
});

it("saves training info", async () => {
  const newRepetition = await request(app)
    .post("/api/repetition")
    .send({ ...body, userId: users[2].id })
    .set("Cookie", global.signin(2))
    .expect(201);

  expect(newRepetition.body.userId).toBeDefined();
  expect(newRepetition.body.card.isPriority).toEqual(true);
  expect(newRepetition.body.status).toEqual(RepetitionStatus.Pending);
  expect(newRepetition.body.interval).toEqual(24);
  expect(newRepetition.body.totalAttempts).toEqual(0);
});
