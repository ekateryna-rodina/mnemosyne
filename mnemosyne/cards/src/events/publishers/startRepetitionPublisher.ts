import { BasePublisher, StartRepetitionEvent, Subjects } from "@meproj/common";

export class StartRepetitionEventPublisher extends BasePublisher<StartRepetitionEvent> {
  subject: Subjects.RepetitionStarted = Subjects.RepetitionStarted;
}
