import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '@App/modules/books/books.service';
import { BookDto } from '@App/modules/books/dto/book.dto';
import { ListBookDto } from '@App/modules/books/dto/list-book.dto';
import { DashboardBooksController } from '@App/modules/books/dashboard/books.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@App/modules/auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@App/modules/auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { ITopRecemendBookResponse } from '@App/modules/books/interfaces/top-recommend-books.interface';

describe('DashboardBooksController', () => {
  let controller: DashboardBooksController;
  let service: BooksService;

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    getTopRecommendBooks: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('Octane123'), // Mock JWT expiration time
  };

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue({ id: '1', username: 'testuser' }), // Mock UserRepository methods
    save: jest.fn().mockResolvedValue({ id: '1', username: 'testuser' }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'), // Mock JwtService methods as needed
    verify: jest.fn().mockReturnValue({ userId: '1' }), // Mock verify if used in your controller
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardBooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService, // Provide mocked JwtService here
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(User), // Mock UserRepository
          useValue: mockUserRepository,
        },
        AuthService,
      ],
    }).compile();

    controller = module.get<DashboardBooksController>(DashboardBooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const bookDto: BookDto = { name: 'Test Book', numberOfPages: 2024 };
      const result = {
        data: {
          id: '1f194333-f9c9-43c2-b406-d8c03803867c',
          ...bookDto,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          readingbooks: [],
        },
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(bookDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(bookDto);
    });
  });

  describe('findAll', () => {
    it('should retrieve all books with pagination', async () => {
      const filterDto: ListBookDto = { page: 1, perPage: 10 };
      const result = {
        data: [
          {
            id: '1f194333-f9c9-43c2-b406-d8c03803867c',
            name: 'Test Book',
            numberOfPages: 200,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            readingbooks: [],
          },
        ],
        total: 1,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(filterDto)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('update', () => {
    it('should update a book by ID', async () => {
      const id = '1f194333-f9c9-43c2-b406-d8c03803867c';
      const bookDto: BookDto = { name: 'Updated Book', numberOfPages: 2025 }; // Corrected property to 'name'
      const result = {};
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(id, bookDto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(id, bookDto);
    });
  });

  describe('getTopRecommendBooks', () => {
    it('should return top recommended books', async () => {
      const recommendedBooks: ITopRecemendBookResponse[] = [
        {
          bookId: '1',
          bookName: 'Book 1',
          numOfPages: 300,
          numOfReadPages: 150,
        },
        {
          bookId: '2',
          bookName: 'Book 2',
          numOfPages: 300,
          numOfReadPages: 200,
        },
      ];

      // Assuming that IResponse has a data property
      const expectedResult = {
        data: recommendedBooks,
        messageStatus: 'success',
      }; // Wrap the result in an object that matches IResponse

      jest
        .spyOn(service, 'getTopRecommendBooks')
        .mockResolvedValue(expectedResult);

      expect(await controller.getTopRecommendBooks()).toEqual(expectedResult);
      expect(service.getTopRecommendBooks).toHaveBeenCalled();
    });

    it('should return an empty array when no books are found', async () => {
      const recommendedBooks: ITopRecemendBookResponse[] = [];

      const expectedResult = {
        data: recommendedBooks,
        messageStatus: 'success',
      }; // Wrap the empty array in the IResponse object

      jest
        .spyOn(service, 'getTopRecommendBooks')
        .mockResolvedValue(expectedResult);

      expect(await controller.getTopRecommendBooks()).toEqual(expectedResult);
      expect(service.getTopRecommendBooks).toHaveBeenCalled();
    });
  });
});
