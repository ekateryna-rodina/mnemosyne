import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../natsWrapper";

it("returns 201 when sign up with valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password123",
      username: "user1",
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("returns 400 with invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "password123",
      username: "user1",
    })
    .expect(400);
});

it("returns 400 with empty password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "",
      username: "user1",
    })
    .expect(400);
});

it("returns 400 with empty username", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "kfjdkfjdfjdi",
      username: "",
    })
    .expect(400);
});

it("returns 400 with empty email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "1234567",
      username: "user1",
    })
    .expect(400);
});

it("returns 400 with short password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "123",
      username: "user1",
    })
    .expect(400);
});

it("returns 400 signup with email in use", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "12345667",
      username: "user1",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "12345667",
      username: "user1",
    })
    .expect(400);
});

it("sets cookie after successfull sigup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test1@gmail.com",
      password: "12345667",
      username: "user1",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
