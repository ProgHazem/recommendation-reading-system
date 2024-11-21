import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IResponse } from '@App/modules/shared/interfaces/response.interface';
import { User } from '@App/modules/auth/entities/user.entity';
import { StoreReadingIntervalDto } from '@App/modules/book-readings/dto/store-reading-interval.dto';
import { Book } from '@App/modules/books/entities/book.entity';
import { ReadingBook } from '@App/modules/book-readings/entities/bookingReading.entity';

@Injectable()
export class BookReadingsService {
  constructor(
    @InjectRepository(ReadingBook)
    private readonly readingIntervalRepository: Repository<ReadingBook>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(
    user: User,
    { bookId, ...storeReadingIntervalDto }: StoreReadingIntervalDto,
  ) {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`There's no book with this id: ${bookId}`);
    }

    // double check if endPage bigger than bookPages
    if (storeReadingIntervalDto.endPage > book.numberOfPages) {
      throw new BadRequestException(
        `EndPage can't be more than the book pages`,
      );
    }

    const readingInterval = {
      ...storeReadingIntervalDto,
      userId: user.id,
    };

    const createdReadingInterval =
      await this.readingIntervalRepository.save(readingInterval);

    return <IResponse<ReadingBook>>{
      data: createdReadingInterval,
      message: 'Successfully created reading Book interval',
      statusMessage: 'success',
    };
  }
}
