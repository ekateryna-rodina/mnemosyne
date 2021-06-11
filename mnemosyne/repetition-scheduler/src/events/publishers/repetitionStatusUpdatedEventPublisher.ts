import {
  BasePublisher,
  Subjects,
  UpdateRepetitionStatusEvent,
} from "@meproj/common";

export class RepetitionStatusUpdatedEventPublisher extends BasePublisher<UpdateRepetitionStatusEvent> {
  subject: Subjects.RepetitionStatusUpdated = Subjects.RepetitionStatusUpdated;
}
