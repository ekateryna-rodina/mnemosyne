import { Message } from "node-nats-streaming";
import { BaseListener } from "./baseListener";
import { CardCreatedEvent } from "./cardCreatedEvent";
import { Subjects } from "./subjects";
class CardCreatedListener extends BaseListener<CardCreatedEvent> {
  subject: Subjects.CardCreated = Subjects.CardCreated;
  queueGroupName = "scheduler-service";

  onMessage(data: CardCreatedEvent["data"], msg: Message) {
    console.log("I am going to schedule a new card!", data);

    msg.ack();
  }
}

export { CardCreatedListener };
