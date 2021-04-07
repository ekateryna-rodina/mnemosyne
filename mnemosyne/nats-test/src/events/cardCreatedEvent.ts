import { Subjects } from "./subjects";

export interface CardCreatedEvent {
  subject: Subjects.CardCreated;
  data: {
    id: string;
    phrase: string;
  };
}
