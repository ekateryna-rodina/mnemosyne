import { BasePublisher, Subjects, UpdateRepetitionEvent } from "@meproj/common";

export class RepetitionUpdatedEventPublisher extends BasePublisher<UpdateRepetitionEvent> {
  subject: Subjects.RepetitionUpdated = Subjects.RepetitionUpdated;
}
