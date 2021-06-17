import { RepetitionStatus } from "../../types/repetitionStatus";
import { Subjects } from "../subjects";

export interface UpdateRepetitionStatusEvent {
  subject: Subjects.RepetitionStatusUpdated;
  data: {
    repetitionIds: string;
    status: RepetitionStatus;
  };
}
