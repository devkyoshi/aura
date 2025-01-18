import { connect_db } from '@config/db';
import authRouter from '@routes/auth_route';
import userRouter from '@routes/user_route';

require('dotenv').config();

import express from 'express';
import cors from 'cors';

//Application initialization
const app = express();
app.use(express.json());
app.use(cors());

//Database connection
connect_db().then((r) => console.log('MongoDB connected successfully'));

//Routes
app.get('/health', (req: any, res: { send: (arg0: string) => void }) => {
  res.send('Aura backend server is running!');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

const PORT = process.env.SERVER_PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}. Closing server gracefully.`);
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });

  // Force close server after 10secs
  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);
};

// Catch unhandled exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception: ', err);
  gracefulShutdown('uncaughtException');
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
