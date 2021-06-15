import { BasePublisher, Subjects, UserFollowedEvent } from "@meproj/common";

export class UserFollowedEventPublisher extends BasePublisher<UserFollowedEvent> {
  subject: Subjects.UserFollowed = Subjects.UserFollowed;
}
