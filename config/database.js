const mongoose = require('mongoose')

const databaseUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/snm'


/**
 * Connects to database
 */
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(databaseUri);
  
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;

