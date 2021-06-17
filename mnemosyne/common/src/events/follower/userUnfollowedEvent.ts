import { Subjects } from "../subjects";

export interface UserUnfollowedEvent {
  subject: Subjects.UserUnfollowed;
  data: {
    userIdFollower: string;
    userIdFollowing: string;
  };
}
