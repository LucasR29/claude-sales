import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggerService } from './common/services/logger.service';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get config service
  const configService = app.get(ConfigService);

  app.use(
    cors({
      origin: '*'
    })
  );
  
  // Use isso:
  const logger = await app.resolve(LoggerService);
  logger.setContext('Bootstrap');
  
  // Set up global prefix
  app.setGlobalPrefix('api');
  
  // Set up validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Sales Management API')
    .setDescription('API for managing sales, products, customers and suppliers')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Start server
  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
