import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './logging/http-exception.filter';
import { LoggingService } from './logging/logging.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  loggingService.log('Application starting...');
  console.log('Test: LoggingService is working!');

  app.useGlobalFilters(new HttpExceptionFilter(loggingService));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalGuards(
    new JwtAuthGuard(
      app.get(ConfigService),
      reflector
    )
  );

  process.on('uncaughtException', (error: Error) => {
    loggingService.error(
      `Uncaught Exception: ${error.message}`,
      error.stack
    );
    console.error('Uncaught Exception - shutting down gracefully...');
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    loggingService.error(
      `Unhandled Rejection at: ${promise}, reason: ${reason}`,
      reason?.stack
    );
    console.error('Unhandled Rejection - shutting down gracefully...');
    process.exit(1);
  });

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
}
bootstrap();
