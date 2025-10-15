// jest.config.js
module.exports = {
    testEnvironment: 'node',
    testMatch: [
      "**/src/**/*.test.js" // Make sure this path is correct
    ],
    // Remove 'dotenv/config' from setupFiles if you are loading envs differently or using jest.setup.js
    setupFilesAfterEnv: ['./jest.setup.js'], // This points to the new setup file
    detectOpenHandles: true,
  };