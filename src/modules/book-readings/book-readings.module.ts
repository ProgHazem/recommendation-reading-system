import { AuthModule } from '@App/modules/auth/auth.module';
import { User } from '@App/modules/auth/entities/user.entity';
import { BookReadingsController } from '@App/modules/book-readings/api/book-readings.controller';
import { BookReadingsService } from '@App/modules/book-readings/book-readings.service';
import { ReadingBook } from '@App/modules/book-readings/entities/bookingReading.entity';
import { Book } from '@App/modules/books/entities/book.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ReadingBook, Book, User])],
  providers: [BookReadingsService],
  controllers: [BookReadingsController],
})
export class BookReadingsModule {}
