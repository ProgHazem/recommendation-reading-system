import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@App/app.controller';
import { AppService } from '@App/app.service';
import pinoConfig from '@App/config/pino.logger.config';
import { validate } from '@App/config/env.validation';
import { configuration } from '@App/config/configuration';
import { CustomExceptionFilter } from '@App/modules/shared/filters/exception.filter';
import { typeOrmModuleOptions } from '@App/config/orm.config';
import { AuthModule } from '@App/modules/auth/auth.module';
import { BooksModule } from '@App/modules/books/books.module';
import { BookReadingsModule } from '@App/modules/book-readings/book-readings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validate }),
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => pinoConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...typeOrmModuleOptions,
      }),
    }),
    AuthModule,
    BooksModule,
    BookReadingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
