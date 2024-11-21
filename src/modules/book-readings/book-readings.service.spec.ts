import { Test, TestingModule } from '@nestjs/testing';
import { BookReadingsService } from './book-readings.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@App/modules/auth/entities/user.entity';
import { Book } from '@App/modules/books/entities/book.entity';
import { ReadingBook } from '@App/modules/book-readings/entities/bookingReading.entity';
import { StoreReadingIntervalDto } from '@App/modules/book-readings/dto/store-reading-interval.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookReadingsService', () => {
  let service: BookReadingsService;
  let mockReadingBookRepository: Partial<
    Record<keyof Repository<ReadingBook>, jest.Mock>
  >;
  let mockBookRepository: Partial<Record<keyof Repository<Book>, jest.Mock>>;

  beforeEach(async () => {
    mockReadingBookRepository = {
      save: jest.fn(),
    };
    mockBookRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookReadingsService,
        {
          provide: getRepositoryToken(ReadingBook),
          useValue: mockReadingBookRepository,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BookReadingsService>(BookReadingsService);
  });

  describe('create', () => {
    const mockUser = { id: '1f194333-f9c9-43c2-b406-d8c03803867c' } as User;
    const mockDto: StoreReadingIntervalDto = {
      bookId: '1f194333-f9c9-43c2-b406-d8c03803867c',
      startPage: 1,
      endPage: 10,
    };

    it('should create a reading interval successfully', async () => {
      const mockBook = { id: mockDto.bookId, numberOfPages: 100 } as Book;
      const mockCreatedInterval = {
        id: '1f194333-f9c9-43c2-b406-d8c03803867c',
        startPage: mockDto.startPage,
        endPage: mockDto.endPage,
        userId: mockUser.id,
        book: mockBook,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockReadingBookRepository.save.mockResolvedValue(mockCreatedInterval);

      const result = await service.create(mockUser, mockDto);

      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDto.bookId },
      });
      expect(mockReadingBookRepository.save).toHaveBeenCalledWith({
        startPage: mockDto.startPage,
        endPage: mockDto.endPage,
        userId: mockUser.id,
      });
      expect(result).toEqual({
        data: mockCreatedInterval,
        message: 'Successfully created reading Book interval',
        statusMessage: 'success',
      });
    });

    it('should throw NotFoundException if book is not found', async () => {
      mockBookRepository.findOne.mockResolvedValue(null);

      await expect(service.create(mockUser, mockDto)).rejects.toThrowError(
        new NotFoundException(
          `There's no book with this id: ${mockDto.bookId}`,
        ),
      );

      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDto.bookId },
      });
      expect(mockReadingBookRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if endPage exceeds book pages', async () => {
      const mockBook = { id: mockDto.bookId, numberOfPages: 5 } as Book;

      mockBookRepository.findOne.mockResolvedValue(mockBook);

      await expect(service.create(mockUser, mockDto)).rejects.toThrowError(
        new BadRequestException(`EndPage can't be more than the book pages`),
      );

      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDto.bookId },
      });
      expect(mockReadingBookRepository.save).not.toHaveBeenCalled();
    });
  });
});
