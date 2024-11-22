import { ReadingBook } from '@App/modules/book-readings/entities/bookingReading.entity';
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
    @InjectRepository(ReadingBook)
    private readonly readingBookRepository: Repository<ReadingBook>,
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

  async getTopRecommendBooks() {
    const topRecommendBooks = await this.readingBookRepository
      .createQueryBuilder('re')
      .select('re.book_id', 'bookId')
      .addSelect('SUM(re.end_page - re.start_page + 1)', 'uniquePages')
      .innerJoin(Book, 'book', 'book.id = re.book_id')
      .where('re.deleted_at IS NULL AND book.deleted_at IS NULL')
      .groupBy('re.book_id')
      .orderBy('SUM(re.end_page - re.start_page + 1)', 'DESC') // Corrected here
      .limit(5)
      .getRawMany();

    // Fetch all book details in a single query for optimization
    const bookIds = topRecommendBooks.map((topBook) => topBook.bookId);
    const books = await this.bookRepository.findByIds(bookIds);

    // Map the raw data to the response structure
    const result = topRecommendBooks
      .map((topBook) => {
        const book = books.find((b) => b.id === topBook.bookId);
        return book
          ? {
              bookId: book.id,
              bookName: book.name,
              numOfPages: book.numberOfPages,
              numOfReadPages: topBook.uniquePages,
            }
          : null;
      })
      .filter((book) => book !== null);

    return { data: result, messageStatus: 'success' };
  }
}
