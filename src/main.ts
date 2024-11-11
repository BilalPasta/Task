import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser'; // Use named import here

// Load .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http', // Indicates it's an HTTP-based scheme
        scheme: 'bearer', // The scheme name is 'bearer'
        bearerFormat: 'JWT', // Optional, but specifying 'JWT' clarifies the token format
      },
      'access-token', // This is the key used to reference the bearer authentication
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable CORS
  app.enableCors({
    origin: '*', // Change to your frontend URL or use '*' carefully for development purposes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.use(cookieParser()); // Enable cookie parsing

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Start listening on the environment's specified port
  const port = process.env.PORT || 8080;
  console.log(`Application is running on port: ${port}`);
  // Azure provides PORT automatically
  await app.listen(port); // Listen on all available network interfaces
  console.log(`Application is running on port: ${port}`);
}

bootstrap();
