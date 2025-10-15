// jest.setup.js

// Import Mongoose to manage the connection
const mongoose = require('mongoose');

// Ensure your .env file is loaded for tests as well if needed
require('dotenv').config();

// Function to close the database connection
const closeDatabaseConnection = async () => {
  if (mongoose.connection.readyState !== 0) { // 0 means disconnected
    await mongoose.connection.close();
    console.log('MongoDB connection closed for tests.');
  }
};

// After all tests are done, close the connection
afterAll(async () => {
  await closeDatabaseConnection();
});

// You might also want to clear collections before each test run
// You can add beforeEach hooks here if needed, e.g.,
// beforeEach(async () => {
//   const collections = Object.keys(mongoose.connection.collections);
//   for (const collectionName of collections) {
//     const collection = mongoose.connection.collections[collectionName];
//     await collection.deleteMany({});
//   }
// });