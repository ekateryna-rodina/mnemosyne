import { BaseListener, EndRepetitionEvent, Subjects } from "@meproj/common";
import { Message } from "node-nats-streaming";
import { Repetition } from "../../models/repetition";
import { queueGroupName } from "../queueGroupName";

export class EndRepetitionListener extends BaseListener<EndRepetitionEvent> {
  subject: Subjects.RepetitionEnded = Subjects.RepetitionEnded;
  queueGroupName = queueGroupName;
  async onMessage(data: EndRepetitionEvent["data"], message: Message) {
    const { cardId, version } = data;
    const repetition = await Repetition.findByIdAndPreVersion({
      cardId,
      version,
    });
    if (!repetition) {
      throw new Error("Could not find repetition");
    }
    await Repetition.deleteOne({ cardId });
    message.ack();
  }
}
