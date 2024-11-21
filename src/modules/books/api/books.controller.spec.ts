import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '@App/modules/books/books.service';
import { RoleGuard } from '@App/modules/auth/guards/role.guard';
import { JwtGuard } from '@App/modules/auth/guards/jwt.guard';
import { ListBookDto } from '@App/modules/books/dto/list-book.dto';
import Role from '@App/modules/auth/enums/role.enum';
import { ExecutionContext } from '@nestjs/common';
import { BooksController } from '@App/modules/books/api/books.controller';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { id: '1', name: 'Book 1', numberOfPages: 200 },
              { id: '2', name: 'Book 2', numberOfPages: 150 },
            ]),
          },
        },
      ],
    })
      .overrideGuard(RoleGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { role: Role.USER }; // Mock user with role
          return true; // Allow access
        }),
      })
      .overrideGuard(JwtGuard)
      .useValue({
        canActivate: jest.fn(() => true), // Mock JwtGuard to always allow access
      })
      .compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of books', async () => {
      const bookFilterDto: ListBookDto = { page: 1, perPage: 10 };
      const result = await controller.findAll(bookFilterDto);

      expect(service.findAll).toHaveBeenCalledWith(bookFilterDto);
      expect(result).toEqual([
        { id: '1', name: 'Book 1', numberOfPages: 200 },
        { id: '2', name: 'Book 2', numberOfPages: 150 },
      ]);
    });
  });
});
