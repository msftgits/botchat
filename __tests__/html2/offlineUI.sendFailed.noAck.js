/** @jest-environment ./packages/testharness2/src/host/jest/WebDriverEnvironment.js */

describe('offline UI', () => {
  test('should display "Send failed. Retry" when activity is sent but not acknowledged', () =>
    runHTML('offlineUI.sendFailed.noAck.html'));
});
