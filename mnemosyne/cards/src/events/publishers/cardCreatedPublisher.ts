import { BasePublisher, CardCreatedEvent, Subjects } from "@meproj/common";

export class CardCreatedEventPublisher extends BasePublisher<CardCreatedEvent> {
  subject: Subjects.CardCreated = Subjects.CardCreated;
}
