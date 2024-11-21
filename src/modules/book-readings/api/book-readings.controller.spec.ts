import { Test, TestingModule } from '@nestjs/testing';
import { BookReadingsController } from './book-readings.controller';
import { BookReadingsService } from '@App/modules/book-readings/book-readings.service';
import { JwtGuard } from '@App/modules/auth/guards/jwt.guard';
import { RoleGuard } from '@App/modules/auth/guards/role.guard';
import { StoreReadingIntervalDto } from '@App/modules/book-readings/dto/store-reading-interval.dto';
import Role from '@App/modules/auth/enums/role.enum';
import { Request } from 'express';

// Create a custom Request interface to include the user property
interface CustomRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

// Mocking the BookReadingsService
const mockBookReadingsService = {
  create: jest.fn(),
};

describe('BookReadingsController', () => {
  let controller: BookReadingsController;

  beforeEach(async () => {
    jest.clearAllMocks(); // Clear mocks before each test
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookReadingsController],
      providers: [
        {
          provide: BookReadingsService,
          useValue: mockBookReadingsService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true), // Mock JWT guard to always pass
      })
      .overrideGuard(RoleGuard)
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true), // Mock Role guard to always pass
      })
      .compile();

    controller = module.get<BookReadingsController>(BookReadingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call BookReadingsService.create with the correct parameters', async () => {
    const createReadingIntervalDto: StoreReadingIntervalDto = {
      startPage: 1,
      endPage: 100,
      bookId: '1f194333-f9c9-43c2-b406-d8c03803867c',
    };

    const mockUser = { id: '1', role: Role.USER };

    // Mock request object with the custom interface
    const request: Partial<CustomRequest> = {
      user: mockUser,
    };

    await controller.create(createReadingIntervalDto, request as CustomRequest);

    // Verify the BookReadingsService.create method was called with the correct arguments
    expect(mockBookReadingsService.create).toHaveBeenCalledTimes(1);
    expect(mockBookReadingsService.create).toHaveBeenCalledWith(
      mockUser,
      createReadingIntervalDto,
    );
  });

  it('should return a response from BookReadingsService.create', async () => {
    const createReadingIntervalDto: StoreReadingIntervalDto = {
      startPage: 1,
      endPage: 100,
      bookId: '1f194333-f9c9-43c2-b406-d8c03803867c',
    };

    const mockUser = { id: '1', role: Role.USER };

    // Mock response from BookReadingsService.create
    const mockResponse = { id: '123', ...createReadingIntervalDto };
    mockBookReadingsService.create.mockResolvedValue(mockResponse);

    const request: Partial<CustomRequest> = {
      user: mockUser,
    };

    const result = await controller.create(
      createReadingIntervalDto,
      request as CustomRequest,
    );

    // Verify the response matches the mock
    expect(result).toEqual(mockResponse);
    expect(mockBookReadingsService.create).toHaveBeenCalledTimes(1);
  });

  it('should handle errors gracefully', async () => {
    const createReadingIntervalDto: StoreReadingIntervalDto = {
      startPage: 1,
      endPage: 100,
      bookId: '1f194333-f9c9-43c2-b406-d8c03803867c',
    };

    const mockUser = { id: '1', role: Role.USER };

    // Mock request object with the custom interface
    const request: Partial<CustomRequest> = {
      user: mockUser,
    };

    // Mock an error in the service
    const mockError = new Error('Service Error');
    mockBookReadingsService.create.mockRejectedValue(mockError);

    await expect(
      controller.create(createReadingIntervalDto, request as CustomRequest),
    ).rejects.toThrow('Service Error');

    // Ensure the service method was called once
    expect(mockBookReadingsService.create).toHaveBeenCalledTimes(1);
  });
});
