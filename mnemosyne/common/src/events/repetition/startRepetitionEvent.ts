import { Subjects } from "../subjects";

export interface StartRepetitionEvent {
  subject: Subjects.RepetitionStarted;
  data: {
    id: string;
    phrase: string;
    keywords: {
      question?: string;
      answer: string;
      options?: number[] | string[];
    }[];
    tags: string[];
    userId: string;
    version: number;
  };
}
