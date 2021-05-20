import { BasePublisher, EndRepetitionEvent, Subjects } from "@meproj/common";

export class EndRepetitionEventPublisher extends BasePublisher<EndRepetitionEvent> {
  subject: Subjects.RepetitionEnded = Subjects.RepetitionEnded;
}
