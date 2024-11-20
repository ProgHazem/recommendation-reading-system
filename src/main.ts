import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { AppModule } from '@App/app.module';
import { Environment } from '@App/config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  const configuration = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Reading Recommendation System API')
      .setDescription('API documentation for reading recommendation system')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
  );

  const environment = configuration.get<Environment>('app.env');

  if (environment == Environment.DEVELOPMENT) {
    SwaggerModule.setup('docs', app, document);
  }

  const port = configuration.get<number>('app.port');
  await app.listen(port);
}
bootstrap();
