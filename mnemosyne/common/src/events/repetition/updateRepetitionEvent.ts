import { RepetitionResult } from "../../types/repetitionResult";
import { Subjects } from "../subjects";

export interface UpdateRepetitionEvent {
  subject: Subjects.RepetitionUpdated;
  data: {
    repetitionId: string;
    cardId: string;
    userId: string;
    version: number;
    result: RepetitionResult;
    totalAttempts: number;
    successfullAttempts: number;
    nextRepetition: string;
  };
}
