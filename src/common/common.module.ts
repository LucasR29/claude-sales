import { Module, Global } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { LoggerService } from './services/logger.service';

@Global()
@Module({
  providers: [EmailService, LoggerService],
  exports: [EmailService, LoggerService],
})
export class CommonModule {} 