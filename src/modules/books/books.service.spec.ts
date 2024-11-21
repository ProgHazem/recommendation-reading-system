import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '@App/modules/books/books.service';
import { Repository } from 'typeorm';
import { Book } from '@App/modules/books/entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookDto } from '@App/modules/books/dto/book.dto';
import { ListBookDto } from '@App/modules/books/dto/list-book.dto';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<any, any>;
};

const mockRepository = {
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
};

describe('BooksService', () => {
  let service: BooksService;
  let repository: MockType<Repository<Book>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get(getRepositoryToken(Book));
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
});
