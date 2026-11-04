import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Global Validation Pipes
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  /**
   * Swagger Configuration
   */

  const config = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('NestJS Application - Blog App API')
    .setDescription('Use the base API URL as http://localhost:3000/api-swagger')
    .setTermsOfService(
      'Use the base API URL as http://localhost:3000/terms-of-service',
    )
    .setLicense(
      'MIT License',
      'https://github.com/ariellesisles/nestjs-intro/blob/main/LICENSE',
    )
    .addServer('http://localhost:3000')
    .build();
  // Init Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
