import { CronJob } from "cron";
import { jobInterval } from "../jobConfig";
import { JobScheduler } from "../jobScheduler";

jest.mock("cron", () => {
  const mScheduleJob = { start: jest.fn() };
  const mCronJob = jest.fn(() => mScheduleJob);
  return { CronJob: mCronJob };
});

it("should schedule and start a job", () => {
  const mDate = jobInterval;
  const mScheduleFunction = jest.fn();
  const mScheduleJob = new CronJob({
    cronTime: mDate,
    onTick: mScheduleFunction,
  });
  JobScheduler.scheduleJob(mDate, mScheduleFunction);
  expect(CronJob).toBeCalledWith(mDate, mScheduleFunction);
  expect(mScheduleJob.start).toBeCalledTimes(1);
});
// every 6 hours
// 0 */6 * * *
