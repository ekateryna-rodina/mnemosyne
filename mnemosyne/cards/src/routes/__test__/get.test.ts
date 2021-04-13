import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { cards, UserNumber, users } from "../../data/mockData";
import { CardDocument } from "../../models/card";

it("fails if user is unauthorized", async () => {
  const body = {
    phrase:
      "Groundhog Day is a 1993 American fantasy comedy film directed by Harold Ramis and written by Ramis and Danny Rubin.",
    keywords: { answer: "Harold Ramis" },
    tags: ["film", "history", "american"],
  };
  const response = await request(app)
    .post("/api/cards")
    .send(body)
    .set("Cookie", global.signin(1))
    .expect(201);
  await request(app).get(`/api/cards/${response.body.id}`).expect(401);
});
it("returns 404 if a card is not found", async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/cards/${id}`)
    .set("Cookie", global.signin(1))
    .expect(404);
});
it("returns a card by id", async () => {
  const userId = users[1].id;
  const response = await request(app)
    .post("/api/cards")
    .set("Cookie", global.signin(1))
    .send({
      phrase:
        "Groundhog Day is a 1993 American fantasy comedy film directed by Harold Ramis and written by Ramis and Danny Rubin.",
      keywords: { answer: "Harold Ramis" },
      tags: ["film", "history", "american"],
    })
    .expect(201);
  await request(app)
    .get(`/api/cards/${response.body.id}`)
    .set("Cookie", global.signin(1))
    .expect(200);
});
it("returns a card with user id", async () => {
  const user = 1;
  const cookie = global.signin(user);
  const postResponse = await request(app)
    .post("/api/cards")
    .set("Cookie", cookie)
    .send({
      phrase:
        "Groundhog Day is a 1993 American fantasy comedy film directed by Harold Ramis and written by Ramis and Danny Rubin.",
      keywords: { answer: "Harold Ramis" },
      tags: ["film", "history", "american"],
    })
    .expect(201);
  const getResponse = await request(app)
    .get(`/api/cards/${postResponse.body.id}`)
    .set("Cookie", cookie)
    .expect(200);
  expect(getResponse.body.userId).toEqual(users[user].id);
});
// get collection
it("returns all users cards", async () => {
  for (let c of cards) {
    const userById: UserNumber = parseInt(
      Object.entries(users).find((e) => c.userId === e[1].id)![0]
    ) as UserNumber;
    await request(app)
      .post("/api/cards")
      .send(c)
      .set("Cookie", global.signin(userById));
  }

  const responseFirstUser = await request(app)
    .get("/api/cards/")
    .set("Cookie", global.signin(1))
    .expect(200);

  expect(responseFirstUser.body.pager.total).toEqual(5);

  const responseSecondUser = await request(app)
    .get("/api/cards/")
    .set("Cookie", global.signin(2))
    .expect(200);

  expect(responseSecondUser.body.pager.total).toEqual(3);

  const responseThirdUser = await request(app)
    .get("/api/cards/")
    .set("Cookie", global.signin(3))
    .expect(200);

  expect(responseThirdUser.body.pager.total).toEqual(9);
});
it("returns all cards sorted asc", async () => {
  for (let c of cards) {
    const userById: UserNumber = parseInt(
      Object.entries(users).find((e) => c.userId === e[1].id)![0]
    ) as UserNumber;
    await request(app)
      .post("/api/cards")
      .send(c)
      .set("Cookie", global.signin(userById));
  }

  const response = await request(app)
    .get("/api/cards/")
    .set("Cookie", global.signin(3))
    .expect(200);

  const data = response.body.cards.map(
    (b: CardDocument) => `${b.phrase}_${b.keywords[0].answer}`
  );
  expect(data[0]).toEqual(
    "Me & My Piano is the debut album from American pop singer Krystal Harris as Krystal._Me & My Piano"
  );
  expect(data[data.length - 1]).toEqual(
    "The original Switchback Railway was the first roller coaster at Coney Island in Brooklyn, New York City, and one of the earliest designed for amusement in the United States._Switchback"
  );
});
it("returns all cards sorted desc", async () => {
  for (let c of cards) {
    const userById: UserNumber = parseInt(
      Object.entries(users).find((e) => c.userId === e[1].id)![0]
    ) as UserNumber;
    await request(app)
      .post("/api/cards")
      .send(c)
      .set("Cookie", global.signin(userById));
  }

  const response = await request(app)
    .get("/api/cards?desc=true")
    .set("Cookie", global.signin(3))
    .expect(200);

  const data = response.body.cards.map(
    (b: CardDocument) => `${b.phrase}_${b.keywords[0].answer}`
  );

  expect(data[data.length - 1]).toEqual(
    "Me & My Piano is the debut album from American pop singer Krystal Harris as Krystal._Me & My Piano"
  );
  expect(data[0]).toEqual(
    "The original Switchback Railway was the first roller coaster at Coney Island in Brooklyn, New York City, and one of the earliest designed for amusement in the United States._Switchback"
  );
});
it("returns cards filtered by tags", async () => {
  for (let c of cards) {
    const userById: UserNumber = parseInt(
      Object.entries(users).find((e) => c.userId === e[1].id)![0]
    ) as UserNumber;
    await request(app)
      .post("/api/cards")
      .send(c)
      .set("Cookie", global.signin(userById));
  }

  const response = await request(app)
    .get("/api/cards?tags=history,mythology")
    .set("Cookie", global.signin(3))
    .expect(200);
  expect(response.body.pager.total).toEqual(3);
});
it("returns cards which belong to the current user including public cards", async () => {
  for (let c of cards) {
    const userById: UserNumber = parseInt(
      Object.entries(users).find((e) => c.userId === e[1].id)![0]
    ) as UserNumber;
    await request(app)
      .post("/api/cards")
      .send(c)
      .set("Cookie", global.signin(userById));
  }

  const response = await request(app)
    .get("/api/cards?showPublic=true")
    .set("Cookie", global.signin(2))
    .expect(200);
  expect(response.body.pager.total).toEqual(6);
});
it("returns paginated result (first page)", async () => {
  for (let c of cards) {
    const userById: UserNumber = parseInt(
      Object.entries(users).find((e) => c.userId === e[1].id)![0]
    ) as UserNumber;
    await request(app)
      .post("/api/cards")
      .send(c)
      .set("Cookie", global.signin(userById));
  }

  const allUserCardsResponse = await request(app)
    .get("/api/cards?limit=3")
    .set("Cookie", global.signin(3));
  const userCardsIds = allUserCardsResponse.body.cards.map(
    (c: CardDocument) => c.id
  );
  const response = await request(app)
    .get(`/api/cards?limit=3&last=${userCardsIds[0]}`)
    .set("Cookie", global.signin(3));
  expect(response.body.pager.total).toEqual(9);
  expect(response.body.cards.length).toEqual(3);
  expect(response.body.cards[0].id).toEqual(userCardsIds[0]);
  expect(response.body.cards[2].id).toEqual(userCardsIds[2]);
});

it("returns paginated result (first page)", async () => {
  for (let c of cards) {
    const userById: UserNumber = parseInt(
      Object.entries(users).find((e) => c.userId === e[1].id)![0]
    ) as UserNumber;
    await request(app)
      .post("/api/cards")
      .send(c)
      .set("Cookie", global.signin(userById));
  }

  const allUserCardsResponse = await request(app)
    .get("/api/cards")
    .set("Cookie", global.signin(3));
  const userCardsIds = allUserCardsResponse.body.cards.map(
    (c: CardDocument) => c.id
  );
  const response = await request(app)
    .get("/api/cards?limit=3")
    .set("Cookie", global.signin(3));
  expect(response.body.pager.total).toEqual(9);
  expect(response.body.cards.length).toEqual(3);
  expect(response.body.cards[0].id).toEqual(userCardsIds[0]);
  expect(response.body.cards[2].id).toEqual(userCardsIds[2]);
});
it("returns paginated result (second page)", async () => {
  for (let c of cards) {
    const userById: UserNumber = parseInt(
      Object.entries(users).find((e) => c.userId === e[1].id)![0]
    ) as UserNumber;
    await request(app)
      .post("/api/cards")
      .send(c)
      .set("Cookie", global.signin(userById));
  }
  const allUserCardsResponse = await request(app)
    .get("/api/cards")
    .set("Cookie", global.signin(3));
  const userCardsIds = allUserCardsResponse.body.cards.map(
    (c: CardDocument) => c.id
  );
  const response = await request(app)
    .get("/api/cards?limit=4&page=1")
    .set("Cookie", global.signin(3));
  expect(response.body.pager.total).toEqual(9);
  expect(response.body.cards.length).toEqual(4);
  expect(response.body.cards[0].id).toEqual(userCardsIds[4]);
  expect(response.body.cards[3].id).toEqual(userCardsIds[7]);
});
