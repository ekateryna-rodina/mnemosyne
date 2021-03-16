import detox from 'detox';
beforeEach(async () => {
  await device.reloadReactNative();
});
beforeAll(async () => {
  await detox.init(undefined, {launchApp: false});
  await device.launchApp({
    newInstance: true,
    launchArgs: {
      DTXEnableVerboseSyncSystem: 'YES',
      DTXEnableVerboseSyncResources: 'YES',
    },
  });
});

afterAll(async () => {
  await detox.cleanup();
});
