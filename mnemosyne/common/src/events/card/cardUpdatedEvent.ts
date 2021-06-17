import { Subjects } from "../subjects";

export interface CardUpdatedEvent {
  subject: Subjects.CardUpdated;
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
    isPublic?: boolean;
    version: number;
    image?: string;
    isPriority?: boolean;
  };
}
