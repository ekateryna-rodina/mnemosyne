import { BaseListener, Subjects, UpdateRepetitionEvent } from "@meproj/common";
import { Message } from "node-nats-streaming";
import { Repetition } from "../../models/repetition";
import { queueGroupName } from "../queueGroupName";
export class UpdateRepetitionListener extends BaseListener<UpdateRepetitionEvent> {
  subject: Subjects.RepetitionUpdated = Subjects.RepetitionUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: UpdateRepetitionEvent["data"], message: Message) {
    const { cardId, version, nextRepetition } = data;
    //   find repetition and update next training date
    const repetition = await Repetition.findByIdAndPreVersion({
      cardId,
      version,
    });
    if (!repetition) {
      throw new Error("Could not find repetition");
    }

    repetition.set({ nextRepetition });
    await repetition.save();

    message.ack();
  }
}
