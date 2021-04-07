import { BasePublisher } from "./basePublisher";
import { CardCreatedEvent } from "./cardCreatedEvent";
import { Subjects } from "./subjects";

export class CardCreatedPublisher extends BasePublisher<CardCreatedEvent> {
  subject: Subjects.CardCreated = Subjects.CardCreated;
}
