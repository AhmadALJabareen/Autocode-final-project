const mongoose = require('mongoose');
require("dotenv").config();
// Function to connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.log('Could not connect to MongoDB:', error.message);
    process.exit(1); // Stop the app if connection fails
  }
};

module.exports = connectDB;