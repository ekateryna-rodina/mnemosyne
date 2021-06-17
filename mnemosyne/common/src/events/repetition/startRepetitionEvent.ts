import { Subjects } from "../subjects";

export interface StartRepetitionEvent {
  subject: Subjects.RepetitionStarted;
  data: {
    repetitionId?: string;
    cardId: string;
    phrase: string;
    keywords: {
      question?: string;
      answer: string;
      options?: number[] | string[];
    }[];
    tags: string[];
    userId: string;
    version: number;
    image?: string;
    isPriority: boolean;
    nextRepetition?: string;
  };
}
