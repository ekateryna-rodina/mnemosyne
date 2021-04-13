import { BasePublisher, CardUpdatedEvent, Subjects } from "@meproj/common";

export class CardUpdatedEventPublisher extends BasePublisher<CardUpdatedEvent> {
  subject: Subjects.CardUpdated = Subjects.CardUpdated;
}
