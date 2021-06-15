import { BasePublisher, Subjects, UserUnfollowedEvent } from "@meproj/common";

export class UserUnfollowedEventPublisher extends BasePublisher<UserUnfollowedEvent> {
  subject: Subjects.UserUnfollowed = Subjects.UserUnfollowed;
}
