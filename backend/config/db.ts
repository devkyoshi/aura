import mongoose from 'mongoose';

export const connect_db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
  } catch (error) {
    console.error('MongoDB connection error: ', error);
    process.exit(1);
  }
};
