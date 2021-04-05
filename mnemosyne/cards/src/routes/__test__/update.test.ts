import request from "supertest";
import { app } from "../../app";

it("allows updates for authorized users", async () => {
  const newPhrase = "Yes, absolutely any";
  const body = {
    phrase: "This could be any area of knowledge",
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  const card = await request(app)
    .post("/api/cards")
    .send(body)
    .set("Cookie", global.signin(2))
    .expect(201);

  const updatedCard = await request(app)
    .patch(`/api/cards/${card.body.id}`)
    .send({ phrase: newPhrase, tags: ["tag5"] })
    .set("Cookie", global.signin(2));

  const response = await request(app)
    .get("/api/cards?limit=1")
    .set("Cookie", global.signin(2));

  expect(response.body.pager.total).toEqual(1);
  expect(updatedCard.body.phrase).toEqual(newPhrase);
  expect(response.body.cards[0].phrase).toEqual(newPhrase);
});
it("fails if user is not authorized", async () => {
  const newPhrase = "Yes, absolutely any";
  const body = {
    phrase: "This could be any area of knowledge",
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  const card = await request(app)
    .post("/api/cards")
    .send(body)
    .set("Cookie", global.signin(2))
    .expect(201);

  await request(app)
    .patch(`/api/cards/${card.body.id}`)
    .send({ phrase: newPhrase })
    .expect(400);
});
it("does not allow to update cards which don't belong to user", async () => {
  const newPhrase = "Yes, absolutely any";
  const body = {
    phrase: "This could be any area of knowledge",
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  const card = await request(app)
    .post("/api/cards")
    .send(body)
    .set("Cookie", global.signin(2))
    .expect(201);

  await request(app)
    .patch(`/api/cards/${card.body.id}`)
    .send({ phrase: newPhrase })
    .set("Cookie", global.signin(3))
    .expect(400);
});

it("fails if id is missing", async () => {
  const body = {
    phrase: "any phrase",
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  const response = await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send(body)
    .expect(201);
  await request(app)
    .patch(`/api/cards/`)
    .send({ phrase: "New phrase" })
    .set("Cookie", global.signin(1))
    .expect(404);
});

it("fails if phrase is missing", async () => {
  const body = {
    phrase: "any phrase",
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  const response = await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send(body)
    .expect(201);
  await request(app)
    .patch(`/api/cards/${response.body.id}`)
    .send({ phrase: "a" })
    .set("Cookie", global.signin(1))
    .expect(400);
});
it("fails if tags array is empty or missing", async () => {
  const body = {
    phrase: "any phrase",
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  const response = await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send(body)
    .expect(201);
  const resp = await request(app)
    .patch(`/api/cards/${response.body.id}`)
    .send({ tags: [] })
    .set("Cookie", global.signin(1))
    .expect(400);
});
