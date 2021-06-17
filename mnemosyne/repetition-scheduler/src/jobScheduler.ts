import { CronCommand, CronJob } from "cron";
export class JobScheduler {
  static scheduleJob = (
    scheduleDate: Date | string,
    scheduleFunction: CronCommand
  ) => {
    const scheduleJob = new CronJob("1 */5 * * * *", scheduleFunction);
    scheduleJob.start();
  };
}
