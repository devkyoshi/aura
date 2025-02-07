import { connect_db } from '@config/db';
import authRouter from '@routes/auth_route';
import userRouter from '@routes/user_route';
import classroomRouter from '@routes/classroom_route';
import cookieParser from 'cookie-parser';

require('dotenv').config();

import express from 'express';
import cors from 'cors';
import { validateJWT } from './middlewares/jwtAuth_middleware';
import logger from '@config/logger';

//Application initialization
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(cookieParser());

//Database connection
connect_db().then(() => logger.info('MongoDB connected successfully!'));

//Routes
app.get('/health', (_req: any, res: { send: (arg0: string) => void }) => {
  res.send('Aura backend server is running!');
});

// Middleware to log incoming requests
app.use((req, _res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl} - ${req.ip}`);

  /*if (req.method !== 'GET') {
    logger.info(`Request Body: ${JSON.stringify(req.body)}`);
  }*/
  next();
});

app.use('/api/auth', authRouter);
app.use(
  '/api/classroom',
  validateJWT as express.RequestHandler,
  classroomRouter
);
app.use('/api/user', validateJWT as express.RequestHandler, userRouter);

const PORT = process.env.SERVER_PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}. Closing server gracefully.`);
  server.close(() => {
    logger.info('Closed out remaining connections');
    process.exit(0);
  });

  // Force close server after 10secs
  setTimeout(() => {
    logger.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);
};

// Catch unhandled exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception: ', err);
  gracefulShutdown('uncaughtException');
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
