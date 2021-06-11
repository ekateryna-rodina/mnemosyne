import { RepetitionStatus } from "@meproj/common";
import moment from "moment";
import { Repetition } from "./models/repetition";

class StatusUpdater {
  constructor() {}

  async checkAndUpdate() {
    const allRepetitions = await Repetition.find();
    for (let r of allRepetitions) {
      let nextRepetition = moment(r.nextRepetition);
      let now = moment();
      var duration = moment.duration(nextRepetition.diff(now));
      var hours = duration.asHours();
      // update status to pending if less than 24 hours left until next repetition
      if (hours <= 24) {
        r.set({ status: RepetitionStatus.InProgress });
        await r.save();
      }
    }
  }
}
