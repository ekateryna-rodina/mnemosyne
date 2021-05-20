import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";
import { Card } from "../../models/card";
import { natsWrapper } from "../../natsWrapper";

it("has a route handler which listens for post requests", async () => {
  const response = await request(app).post("/api/cards").send({});
  expect(response.status).not.toEqual(404);
});
it("does not return 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send({});
  expect(response.status).not.toEqual(401);
});
it("throws an error if user is not signed in", async () => {
  const body = {
    phrase:
      "Groundhog Day is a 1993 American fantasy comedy film directed by Harold Ramis and written by Ramis and Danny Rubin.",
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  const response = await request(app).post("/api/cards").send(body);
  expect(response.status).toEqual(401);
});
it("fails if tags array is empty or missing", async () => {
  const body = {
    phrase:
      "Groundhog Day is a 1993 American fantasy comedy film directed by Harold Ramis and written by Ramis and Danny Rubin.",
    keywords: { answer: "Harold Ramis" },
  };
  await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send(body)
    .expect(400);

  await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send({ ...body, tags: [] })
    .expect(400);
});
it("fails if phrase missing", async () => {
  const body = {
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send(body)
    .expect(400);
});
it("save data to db", async () => {
  let cards = await Card.find({});
  expect(cards.length).toEqual(0);
  const phrase =
    "Groundhog Day is a 1993 American fantasy comedy film directed by Harold Ramis and written by Ramis and Danny Rubin.";
  const userId = users[1].id;
  const body = {
    phrase,
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send(body);

  cards = await Card.find({});
  expect(cards.length).toEqual(1);
  expect(cards[0].phrase).toEqual(phrase);
  expect(JSON.stringify(cards[0].userId)).toStrictEqual(JSON.stringify(userId));
});
it("returns 201 on successfull creation", async () => {
  const userId = users[1].id;
  const body = {
    phrase:
      "Groundhog Day is a 1993 American fantasy comedy film directed by Harold Ramis and written by Ramis and Danny Rubin.",
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  const response = await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send(body)
    .expect(201);

  expect(response.body.userId).toEqual(userId);
});
it("it publishes an event", async () => {
  const userId = users[1].id;
  const body = {
    phrase:
      "Groundhog Day is a 1993 American fantasy comedy film directed by Harold Ramis and written by Ramis and Danny Rubin.",
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  const response = await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send(body)
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
