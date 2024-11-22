import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '@App/modules/books/books.service';
import { Repository } from 'typeorm';
import { Book } from '@App/modules/books/entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookDto } from '@App/modules/books/dto/book.dto';
import { ListBookDto } from '@App/modules/books/dto/list-book.dto';
import { ReadingBook } from '@App/modules/book-readings/entities/bookingReading.entity';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<any, any>;
};

const mockRepository = {
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  findByIds: jest.fn().mockResolvedValue([]), // Mock findByIds method
  update: jest.fn(),
};

const mockCreateQueryBuilder = {
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([]), // Empty array or mock your results here
  }),
};

describe('BooksService', () => {
  let service: BooksService;
  let repository: MockType<Repository<Book>>;
  let readingBookRepository: MockType<Repository<ReadingBook>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ReadingBook),
          useValue: mockCreateQueryBuilder,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get(getRepositoryToken(Book));
    readingBookRepository = module.get(getRepositoryToken(ReadingBook));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book and return a response', async () => {
      const bookDto: BookDto = { name: 'Book 1', numberOfPages: 100 };
      const savedBook: Book = {
        id: '1f194333-f9c9-43c2-b406-d8c03803867c',
        ...bookDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        readingbooks: [],
      };

      repository.save.mockResolvedValue(savedBook);

      const result = await service.create(bookDto);

      expect(repository.save).toHaveBeenCalledWith(bookDto);
      expect(result).toEqual({
        data: savedBook,
        message: 'Book created successfully',
        statusMessage: 'success',
      });
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of books', async () => {
      const listBookDto: ListBookDto = {
        page: 1,
        perPage: 2,
        search: 'Book',
        numberOfPages: 100,
      };
      const books = [
        {
          id: '1f194333-f9c9-43c2-b406-d8c03803867c',
          name: 'Book 1',
          numberOfPages: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: '1f194333-f9c9-43c2-b406-d8c03803867d',
          name: 'Book 2',
          numberOfPages: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: '1f194333-f9c9-43c2-b406-d8c03803867e',
          name: 'Book 3',
          numberOfPages: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: '1f194333-f9c9-43c2-b406-d8c03803867f',
          name: 'Book 4',
          numberOfPages: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: '1f194333-f9c9-43c2-b406-d8c03803867g',
          name: 'Book 5',
          numberOfPages: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      repository.findAndCount.mockResolvedValue([books, 5]);

      const result = await service.findAll(listBookDto);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {
          name: listBookDto.search,
          numberOfPages: listBookDto.numberOfPages,
        },
        skip: 0,
        take: 2,
      });

      expect(result).toEqual({
        data: books,
        pagination: {
          page: 1,
          totalPages: 3,
          count: 5,
          perPage: 2,
        },
        message: 'Books retrieved successfully',
        statusMessage: 'success',
      });
    });
  });

  describe('update', () => {
    it('should update an existing book and return a response', async () => {
      const id = '1';
      const bookDto: BookDto = { name: 'Updated Book', numberOfPages: 120 };
      const existingBook = {
        id: '1f194333-f9c9-43c2-b406-d8c03803867c',
        ...bookDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      repository.findOneBy.mockResolvedValue(existingBook);
      repository.update.mockResolvedValue(undefined);

      const result = await service.update(id, bookDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.update).toHaveBeenCalledWith(id, bookDto);

      expect(result).toEqual({
        data: {},
        message: 'Book updated successfully',
        statusMessage: 'success',
      });
    });

    it('should throw an error if the book does not exist', async () => {
      const id = '1';
      const bookDto: BookDto = {
        name: 'Non-existent Book',
        numberOfPages: 120,
      };

      repository.findOneBy.mockResolvedValue(null);

      await expect(service.update(id, bookDto)).rejects.toThrowError(
        'Book not found',
      );

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.update).toHaveBeenCalled();
    });
  });

  describe('getTopRecommendBooks', () => {
    it('should return top recommended books', async () => {
      const top5Books = [
        { bookId: '1', uniquePages: 150 },
        { bookId: '2', uniquePages: 200 },
      ];

      // Mock readingBookRepository query builder to return expected results
      readingBookRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(top5Books), // Mocking the expected results
      });

      // Mock bookRepository to return book details based on the bookId
      repository.findOne.mockImplementation((query) => {
        if (query.where.id === '1') {
          return Promise.resolve({
            id: '1',
            name: 'Book 1',
            numberOfPages: 300,
          });
        }
        if (query.where.id === '2') {
          return Promise.resolve({
            id: '2',
            name: 'Book 2',
            numberOfPages: 250,
          });
        }
        return Promise.resolve(null);
      });

      // Call the service method
      const result = await service.getTopRecommendBooks();

      // Assertions
      expect(readingBookRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual({ data: [], messageStatus: 'success' });
    });

    it('should return an empty array when no books are found', async () => {
      // Mock readingBookRepository query builder to return no results
      readingBookRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]), // Mocking no results
      });

      // Call the service method
      const result = await service.getTopRecommendBooks();

      // Assertions
      expect(result.data).toEqual([]); // Should return an empty array
      expect(result.messageStatus).toBe('success');
    });
  });
});
