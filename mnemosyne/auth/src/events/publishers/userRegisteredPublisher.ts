import { BasePublisher, Subjects, UserRegisteredEvent } from "@meproj/common";

export class UserRegisteredEventPublisher extends BasePublisher<UserRegisteredEvent> {
  subject: Subjects.UserRegistered = Subjects.UserRegistered;
}
