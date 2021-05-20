import mongoose from "mongoose";
import { Card } from "../card";

it("throws error on update with incorrect version", async (done) => {
  const card = Card.build({
    phrase: "any",
    tags: ["tag"],
    keywords: [{ answer: "some" }],
    userId: mongoose.Types.ObjectId().toString(),
  });

  await card.save();

  const first = await Card.findById(card.id);
  const second = await Card.findById(card.id);

  first!.set({ phrase: "change" });
  second!.set({ phrase: "newchange" });

  await first!.save();

  try {
    await second!.save();
  } catch (error) {
    return done();
  }
});

it("updates the version", async () => {
  const card = Card.build({
    phrase: "any",
    tags: ["tag"],
    keywords: [{ answer: "some" }],
    userId: mongoose.Types.ObjectId().toString(),
  });

  await card.save();
  expect(card.version).toEqual(0);
  await card.save();
  expect(card.version).toEqual(1);
  await card.save();
  expect(card.version).toEqual(2);
});
