import { BookDto } from '@App/modules/books/dto/book.dto';
import { ListBookDto } from '@App/modules/books/dto/list-book.dto';
import { Book } from '@App/modules/books/entities/book.entity';
import { IPagination } from '@App/modules/shared/interfaces/pagination.interface';
import { IResponse } from '@App/modules/shared/interfaces/response.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}
  async create(bookDto: BookDto) {
    const book = await this.bookRepository.save(bookDto);
    return <IResponse<Book>>{
      data: book,
      message: 'Book created successfully',
      statusMessage: 'success',
    };
  }

  async findAll({ page, perPage, ...listBookDto }: ListBookDto) {
    const skip = (page - 1) * perPage;
    const [books, count] = await this.bookRepository.findAndCount({
      where: {
        name: listBookDto.search,
        numberOfPages: listBookDto.numberOfPages,
      },
      skip,
      take: perPage,
    });

    const totalPages = Math.ceil(count / perPage);
    const pagination: IPagination = {
      page,
      totalPages,
      count,
      perPage,
    };
    return <IResponse<Book[]>>{
      data: books,
      pagination,
      message: 'Books retrieved successfully',
      statusMessage: 'success',
    };
  }

  async update(id: string, bookDto: BookDto) {
    const existingBook = await this.bookRepository.findOneBy({ id });
    if (!existingBook) {
      throw new Error('Book not found'); // Replace with appropriate error handling
    }

    await this.bookRepository.update(id, bookDto);
    return <IResponse<Book>>{
      data: {},
      message: 'Book updated successfully',
      statusMessage: 'success',
    };
  }
}
