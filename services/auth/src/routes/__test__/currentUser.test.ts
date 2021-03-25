import request from "supertest";
import { app } from "../../app";
import { getCookie } from "../../utils/test";

it("fill response with user info", async () => {
  const cookie = await getCookie();
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.currentUser["id"]).toBeDefined();
  expect(response.body.currentUser["email"]).toEqual("test@example.com");
});

it("user info is null for anonymous", async () => {
  const signup = await request(app).get("/api/users/currentuser").expect(200);
  expect(signup.body.currentUser).toEqual(null);
});
