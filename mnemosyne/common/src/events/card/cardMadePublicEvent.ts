import { Subjects } from "../subjects";

export interface CardMadePublicEvent {
  subject: Subjects.CardMadePublic;
  data: {
    id: string;
    phrase: string;
    image?: string;
    userId: string;
    tags: string[];
    version: number;
  };
}
