import { Subjects } from "../subjects";

export interface CardDeletedEvent {
  subject: Subjects.CardDeleted;
  data: {
    id: string;
    userId: string;
    version: number;
  };
}
