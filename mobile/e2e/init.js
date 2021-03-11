import detox from 'detox';
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

beforeEach(async () => {
  await device.reloadReactNative();
});

afterAll(async () => {
  await detox.cleanup();
});
