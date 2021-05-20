export enum RepetitionStatus {
  // 24 hours before training should be started
  Pending = "Pending",
  // training in progress
  InProgress = "InProgress",
  // Recently trained
  Revisited = "Revisited",
  // completed all intervals
  Completed = "Completed",
}
