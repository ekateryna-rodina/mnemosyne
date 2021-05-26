import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";

it("get repetitions is accessible", async () => {
  const userId = users[2].id;
  await request(app)
    .get("/api/repetition")
    .set("Cookie", global.signin(2))
    .expect(200);

  await request(app).get("/api/repetition").expect(401);
});

// it("returns repetition by userId", async () => {
//   async function createUpdateRepetition(model: {
//     userNumber: UserNumber;
//     result: RepetitionResult;
//     phrase: string;
//     version: number;
//     keywords: {
//       question?: string;
//       answer: string;
//       options?: string[] | number[];
//     }[];
//   }) {
//     const { userNumber, phrase, keywords, result } = model;
//     const userId = users[userNumber].id;
//     const body: ICard = {
//       id: mongoose.Types.ObjectId().toString(),
//       keywords,
//       phrase,
//       userId,
//       tags: ["tag"],
//       version: 1,
//     };

//     const repetitionResponse = await request(app)
//       .post("/api/repetition")
//       .send(body)
//       .set("Cookie", global.signin(userNumber))
//       .expect(201);

//     await request(app)
//       .patch(`/api/repetition/${repetitionResponse.body.id}`)
//       .send({ cardId: body.id, result })
//       .set("Cookie", global.signin(userNumber))
//       .expect(200);
//   }

//   const model1 = {
//     phrase: "phrase1",
//     keywords: [{ answer: "answer1" }],
//     userNumber: 1 as UserNumber,
//     result: RepetitionResult.Failure,
//     version: 2,
//   };
//   const model2 = {
//     phrase: "phrase2",
//     keywords: [{ answer: "answer2" }],
//     userNumber: 1 as UserNumber,
//     result: RepetitionResult.Success,
//     version: 2,
//   };
//   const model3 = {
//     phrase: "phrase2",
//     keywords: [{ answer: "answer2" }],
//     userNumber: 2 as UserNumber,
//     result: RepetitionResult.Success,
//     version: 2,
//   };

//   for (let model of [model1, model2, model3]) {
//     await createUpdateRepetition(model);
//   }

//   const response1 = await request(app)
//     .get("/api/repetition")
//     .set("Cookie", global.signin(1))
//     .expect(200);

//   const response2 = await request(app)
//     .get("/api/repetition")
//     .set("Cookie", global.signin(2))
//     .expect(200);

//   expect(response1.body.length).toEqual(2);
//   expect(response1.body[0].interval).toEqual(24);
//   expect(response1.body[0].successfullAttempts).toEqual(0);
//   expect(response1.body[1].interval).toEqual(36);
//   expect(response1.body[1].successfullAttempts).toEqual(1);
//   expect(response2.body.length).toEqual(1);
// });
