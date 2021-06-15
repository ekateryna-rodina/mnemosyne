import request from "supertest";
import { app } from "../app";

test.skip("skip", () => {});

export const getCookie = async () => {
  const response = await request(app).post("/api/users/signup").send({
    email: "test@example.com",
    password: "1234567",
    username: "user1",
  });

  return response.get("Set-Cookie");
};
