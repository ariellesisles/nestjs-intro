import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createAppValidationPipe } from './common/pipes/validation.config';
import { setupSwagger } from './common/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Global Validation Pipes
   */
  app.useGlobalPipes(createAppValidationPipe());
  /**
   * Swagger Configuration
   */
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
