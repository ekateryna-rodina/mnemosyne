import { Subjects } from "../subjects";

export interface CardCreatedEvent {
  subject: Subjects.CardCreated;
  data: {
    id: string;
    phrase: string;
    keywords: {
      question?: string;
      answer: string;
      options?: string[] | number[];
    }[];
    tags: string[];
    userId: string;
    isPublic?: boolean;
    version: number;
    image?: string;
    inRepetition?: boolean;
  };
}
