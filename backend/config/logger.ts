import winston from 'winston';

/**
 * const logFormat = winston.format.combine(
 *   winston.format.colorize(),
 *   winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to logs
 *   winston.format.printf(({ timestamp, level, message }) => {
 *     return `${timestamp} ${level}: ${message}`;
 *   })
 * );
 */

// Define the log format
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ level, message }) => {
    return `${level}: ${message}`;
  })
);

// Create the Winston logger instance
const logger = winston.createLogger({
  level: 'info', // Set default log level
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }), // Log to console
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

export default logger;
