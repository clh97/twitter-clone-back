import winston from 'winston';
import expressWinston from 'express-winston';

const createLogger = () => {
  const logger = expressWinston.logger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), winston.format.simple(), winston.format.colorize()),
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: 'logs/all.log',
        maxsize: 5096 * 1024 * 1024,
      }),
    ],
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    meta: true,
    expressFormat: true,
    colorize: false,
    ignoreRoute: function () {
      return false;
    },
  });
  return logger;
};

export default { createLogger };
