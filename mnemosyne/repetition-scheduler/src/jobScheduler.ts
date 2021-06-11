import { CronCommand, CronJob } from "cron";
export class JobScheduler {
  static scheduleJob = (
    scheduleDate: Date | string,
    scheduleFunction: CronCommand
  ) => {
    const date = new Date(scheduleDate);
    const scheduleJob = new CronJob(scheduleDate, scheduleFunction);
    scheduleJob.start();
  };
}
