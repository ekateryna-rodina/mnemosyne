import {
  BaseListener,
  RepetitionResult,
  Subjects,
  UpdateRepetitionEvent,
} from "@meproj/common";
import { Message } from "node-nats-streaming";
import { RepetitionHistory } from "../../models/repetitionHistory";
import { queueGroupName } from "../queueGroupName";

export class UpdateRepetitionListener extends BaseListener<UpdateRepetitionEvent> {
  subject: Subjects.RepetitionUpdated = Subjects.RepetitionUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: UpdateRepetitionEvent["data"], message: Message) {
    const {
      repetitionId,
      cardId,
      userId,
      version,
      result,
      totalAttempts,
      successfullAttempts,
    } = data;

    const newTotal = totalAttempts + 1;
    const newSuccessfull =
      result == RepetitionResult.Success
        ? successfullAttempts + 1
        : successfullAttempts;

    const repetitionHistoryDoc = RepetitionHistory.build({
      repetitionId,
      cardId,
      card: cardId,
      userId,
      version,
      result,
      totalAttempts,
      successfullAttempts,
    });

    await repetitionHistoryDoc.save();

    message.ack();
  }
}
