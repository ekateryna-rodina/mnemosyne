import request from "supertest";
import { app } from "../../app";

it("sends status 200 on delete", async () => {
  const response = await request(app)
    .post("/api/cards/")
    .send({
      phrase:
        "The original Switchback Railway was the first roller coaster at Coney Island in Brooklyn, New York City, and one of the earliest designed for amusement in the United States.",
      keywords: { answer: "New York City" },
      tags: ["tag1"],
    })
    .set("Cookie", global.signin(1))
    .expect(201);
  console.log(response.body);
  await request(app)
    .delete(`/api/cards/${response.body.id}`)
    .set("Cookie", global.signin(1))
    .expect(200);
});

it("the card is removed sucessfully", async () => {
  const postResponse = await request(app)
    .post("/api/cards")
    .send({
      phrase:
        "The original Switchback Railway was the first roller coaster at Coney Island in Brooklyn, New York City, and one of the earliest designed for amusement in the United States",
      tags: ["tag1"],
      keywords: { answer: "Harold Ramis" },
    })
    .set("Cookie", global.signin(2))
    .expect(201);

  const savedCardsResponse = await request(app)
    .get("/api/cards")
    .set("Cookie", global.signin(2));
  expect(savedCardsResponse.body.pager.total).toEqual(1);

  await request(app)
    .delete(`/api/cards/${postResponse.body.id}`)
    .set("Cookie", global.signin(2))
    .expect(200);
  const afterRemovalResponse = await request(app)
    .get("/api/cards")
    .set("Cookie", global.signin(2));
  expect(afterRemovalResponse.body.pager.total).toEqual(0);
});

it("fails if user is not authorized", async () => {
  const response = await request(app)
    .post("/api/cards/")
    .send({
      phrase:
        "The original Switchback Railway was the first roller coaster at Coney Island in Brooklyn, New York City, and one of the earliest designed for amusement in the United States.",
      keywords: { answer: "New York City" },
      tags: ["tag1"],
    })
    .set("Cookie", global.signin(2));
  await request(app).delete(`/api/cards/${response.body.id}`).expect(401);
});
it("fails if user id does not match", async () => {
  const response = await request(app)
    .post("/api/cards/")
    .send({
      phrase:
        "The original Switchback Railway was the first roller coaster at Coney Island in Brooklyn, New York City, and one of the earliest designed for amusement in the United States.",
      keywords: { answer: "New York City" },
      tags: ["tag1"],
    })
    .set("Cookie", global.signin(2));
  await request(app)
    .delete(`/api/cards/${response.body.id}`)
    .set("Cookie", global.signin(1))
    .expect(400);
});
