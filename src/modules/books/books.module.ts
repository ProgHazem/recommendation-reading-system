import { AuthModule } from '@App/modules/auth/auth.module';
import { BooksController } from '@App/modules/books/api/books.controller';
import { BooksService } from '@App/modules/books/books.service';
import { DashboardBooksController } from '@App/modules/books/dashboard/books.controller';
import { Book } from '@App/modules/books/entities/book.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Book])],
  controllers: [DashboardBooksController, BooksController],
  providers: [BooksService],
})
export class BooksModule {}