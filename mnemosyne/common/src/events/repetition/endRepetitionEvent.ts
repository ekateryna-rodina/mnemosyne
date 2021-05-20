import { Subjects } from "../subjects";

export interface EndRepetitionEvent {
  subject: Subjects.RepetitionEnded;
  data: {
    id: string;
    userId: string;
    version: number;
  };
}
