import { Subjects } from "../subjects";

export interface UserFollowedEvent {
  subject: Subjects.UserFollowed;
  data: {
    userIdFollowing: string; // follower
    userIdFollower: string; // following
    img: string;
    username: string;
  };
}
