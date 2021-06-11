import { RepetitionStatus } from "@meproj/common";
import moment from "moment";
import mongoose from "mongoose";
import { users } from "../data/mockData";
import { Card, ICard } from "../models/card";
import { Repetition } from "../models/repetition";
import { natsWrapper } from "../natsWrapper";
import { StatusUpdater } from "../statusUpdater";
let repetition1Id = mongoose.Types.ObjectId().toString();
let repetition2Id = mongoose.Types.ObjectId().toString();
let repetition3Id = mongoose.Types.ObjectId().toString();
beforeEach(async () => {
  // create cards
  let repetitionToUpdate;
  const userId = users[2].id;
  const body1: ICard = {
    id: mongoose.Types.ObjectId().toString(),
    keywords: [{ answer: "answer 1" }],
    phrase: "phrase 1",
    userId,
    isPriority: true,
    tags: ["tag1"],
    version: 0,
  };

  const body2: ICard = {
    id: mongoose.Types.ObjectId().toString(),
    keywords: [{ answer: "answer 2" }],
    phrase: "phrase 2",
    userId,
    isPriority: true,
    tags: ["tag2"],
    version: 0,
  };

  const body3: ICard = {
    id: mongoose.Types.ObjectId().toString(),
    keywords: [{ answer: "answer 3" }],
    phrase: "phrase 3",
    userId,
    isPriority: true,
    tags: ["tag3"],
    version: 0,
  };

  const card1 = Card.build(body1);
  await card1.save();

  const card2 = Card.build(body2);
  await card2.save();

  const card3 = Card.build(body3);
  await card3.save();
  // create repetitions
  const repetition1 = Repetition.build({
    id: repetition1Id,
    cardId: card1.id,
    card: card1,
    userId,
    version: 0,
  });
  await repetition1.save();

  const repetition2 = Repetition.build({
    id: repetition2Id,
    cardId: card2.id,
    card: card2,
    userId,
    version: 0,
  });
  await repetition2.save();

  const repetition3 = Repetition.build({
    id: repetition3Id,
    cardId: card3.id,
    card: card3,
    userId,
    version: 0,
  });
  await repetition3.save();
  // update repetitions
  // resume in few days

  repetitionToUpdate = await Repetition.findOne({ _id: repetition1.id });
  repetitionToUpdate!.set(
    "nextRepetition",
    moment().add(3, "days").toISOString()
  );
  await repetitionToUpdate!.save();
  // resume in 15 hours
  repetitionToUpdate = await Repetition.findOne({ _id: repetition2.id });
  repetitionToUpdate!.set(
    "nextRepetition",
    moment().add(15, "hours").toISOString()
  );
  await repetitionToUpdate!.save();
  // should be resumed now
  repetitionToUpdate = await Repetition.findOne({ _id: repetition3.id });
  repetitionToUpdate!.set(
    "nextRepetition",
    moment().subtract(3, "hours").toISOString()
  );
  await repetitionToUpdate!.save();
});
it("should foreach repetitions and update statuses to Pending or InProgress depending on next reepetition date", async () => {
  await StatusUpdater.checkAndUpdate();
  let repetition1 = await Repetition.findOne({ _id: repetition1Id });
  let repetition2 = await Repetition.findOne({ _id: repetition2Id });
  let repetition3 = await Repetition.findOne({ _id: repetition3Id });

  expect(repetition1).toBeDefined();
  expect(repetition1!.status).toEqual(RepetitionStatus.Idle);

  expect(repetition2).toBeDefined();
  expect(repetition2!.status).toEqual(RepetitionStatus.Pending);

  expect(repetition3).toBeDefined();
  expect(repetition3!.status).toEqual(RepetitionStatus.InProgress);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(3);
});
