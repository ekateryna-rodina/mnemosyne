import request from "supertest";
import { app } from "../../app";

it("returns 200 when sign in with valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password123",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "password123",
    })
    .expect(200);
});

it("returns 400 when sign in with non existent email", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "password123",
    })
    .expect(400);
});

it("returns 400 with invalid email or password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      password: "password123",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "email@gmail.com",
    })
    .expect(400);
});

it("sets cookie after successfull signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password123",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "password123",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
