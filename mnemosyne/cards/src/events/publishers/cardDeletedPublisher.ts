import { BasePublisher, CardDeletedEvent, Subjects } from "@meproj/common";

export class CardDeletedEventPublisher extends BasePublisher<CardDeletedEvent> {
  subject: Subjects.CardDeleted = Subjects.CardDeleted;
}
