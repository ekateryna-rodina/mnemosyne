import { RepetitionResult } from "@meproj/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { users } from "../../data/mockData";
import { Card, ICard } from "../../models/card";
import { Repetition } from "../../models/repetition";
import { natsWrapper } from "../../natsWrapper";

it("updates fields and publishes an event", async () => {
  const userId = users[2].id;
  const body: ICard = {
    id: mongoose.Types.ObjectId().toString(),
    keywords: [{ answer: "Harold Allen Ramis" }],
    phrase:
      "Harold Allen Ramis was an American actor, comedian, director and writer. His best-known film acting roles were as Egon Spengler in Ghostbusters and Ghostbusters II, and as Russell Ziskey in Stripes; ",
    userId,
    isPriority: true,
    tags: ["tag1"],
    version: 2,
  };

  const card = Card.build(body);
  await card.save();

  const repetition = await Repetition.build({
    cardId: card.id,
    card,
    userId,
    version: 0,
  });
  await repetition.save();
  const updatedRepetitionResponse = await request(app)
    .patch(`/api/repetition/${repetition.id}`)
    .send({ cardId: body.id, result: RepetitionResult.Success })
    .set("Cookie", global.signin(2))
    .expect(200);

  expect(updatedRepetitionResponse.body).not.toBeNull();
  expect(updatedRepetitionResponse.body?.totalAttempts).toEqual(
    repetition.totalAttempts + 1
  );
  expect(updatedRepetitionResponse.body?.successfullAttempts).toEqual(
    repetition.successfullAttempts + 1
  );

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
