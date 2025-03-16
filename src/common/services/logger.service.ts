import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.DEFAULT })
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor(private configService: ConfigService) {}

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(`[${this.context}] ${message}`, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(`[${this.context}] ERROR: ${message}`, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(`[${this.context}] WARN: ${message}`, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.configService.get('environment') === 'development') {
      console.debug(`[${this.context}] DEBUG: ${message}`, ...optionalParams);
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.configService.get('environment') === 'development') {
      console.log(`[${this.context}] VERBOSE: ${message}`, ...optionalParams);
    }
  }
} 