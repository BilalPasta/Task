// src/config/winston.config.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class WinstonConfigService {
  constructor(private configService: ConfigService) {}

  createLogger() {
    const logLevel = this.configService.get<string>('LOG_LEVEL', 'info');

    return winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'combined.log',
        }),
      ],
    });
  }
}
