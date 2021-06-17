import { Subjects } from "../subjects";

export interface EndRepetitionEvent {
  subject: Subjects.RepetitionEnded;
  data: {
    cardId: string;
    userId: string;
    version: number;
  };
}
