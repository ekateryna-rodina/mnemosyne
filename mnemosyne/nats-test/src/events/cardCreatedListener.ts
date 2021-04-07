import { Message } from "node-nats-streaming";
import { BaseListener } from "./baseListener";
class CardCreatedListener extends BaseListener {
  subject = "card:created";
  queueGroupName = "scheduler-service";

  onMessage(data: any, msg: Message) {
    console.log("I am going to schedule a new card!", data);

    msg.ack();
  }
}

export { CardCreatedListener };
