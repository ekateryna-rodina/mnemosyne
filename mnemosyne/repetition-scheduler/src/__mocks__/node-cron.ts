export const cron = {
  schedule: async (frequency: any, callback: any) => {
    await callback();
  },
};
