const logger = require('../utils/logger');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true});
    logger.info('Connected to MongoDB successfully');
    logger.info(`Database connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error('Failed to connect to MongoDB: ', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
