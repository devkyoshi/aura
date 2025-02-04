import mongoose from 'mongoose';
import logger from '@config/logger';

export const connect_db = async () => {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL as string);
  } catch (error) {
    logger.error('Error while connecting to Mongo DB: ', error);
    process.exit(1);
  }
};
