import request from "supertest";
import { app } from "../../app";

it("returns 201 when sign up with valid credentials", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password123",
    })
    .expect(201);
});

it("returns 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "password123",
    })
    .expect(400);
});

it("returns 400 with empty password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "",
    })
    .expect(400);
});

it("returns 400 with empty email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "1234567",
    })
    .expect(400);
});

it("returns 400 with short password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "123",
    })
    .expect(400);
});

it("returns 400 signup with email in use", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "12345667",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "12345667",
    })
    .expect(400);
});

it("sets cookie after successfull sigup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test1@gmail.com",
      password: "12345667",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
