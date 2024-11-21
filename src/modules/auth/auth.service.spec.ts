import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { User } from '@App/modules/auth/entities/user.entity';
import { RegisterDto } from '@App/modules/auth/dto/register.dto';
import { LoginDto } from '@App/modules/auth/dto/login.dto';
import { AuthService } from '@App/modules/auth/auth.service';
import Role from '@App/modules/auth/enums/role.enum';
import { getRepositoryToken } from '@nestjs/typeorm';

// Mocking the required services
const mockUserRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('Octane123'), // Mock JWT expiration time
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mockToken'), // Mock JWT token generation
};

describe('AuthService', () => {
  let authService: AuthService;

  // Sample input data
  const registerDto: RegisterDto = {
    email: 'test@test.com',
    password: 'Octane@123',
  };
  const loginDto: LoginDto = { email: 'test@test.com', password: 'Octane@123' };

  // Mock user data
  const mockUser: User = {
    id: '1f194333-f9c9-43c2-b406-d8c03803867c',
    email: 'test@test.com',
    password:
      'a8a0a647dbfe56130794053756f98282f5255e7d374a88442b438ab8262ab49e8e36672083e5edfc8ea198fabdbed8de9d46acbd0b5e0276e41ad22e399463e8',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    readingbooks: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository, // Correctly mock Repository<User>
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user and return a response', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null); // No existing user
      mockUserRepository.save.mockResolvedValue(mockUser);

      const response = await authService.register(registerDto);
      expect(response.message).toBe('Successfully Registered');
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          password: expect.any(String),
        }),
      );
    });

    it('should throw an error if user already exists', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser); // User already exists

      await expect(authService.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should successfully log in a user and return a token', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser); // User found
      mockJwtService.signAsync.mockResolvedValue('mockToken');

      const response = await authService.login(loginDto);

      expect(response).toHaveProperty('user');

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
    });

    it('should throw an error if user is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null); // User not found

      await expect(authService.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if password does not match', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser); // User found
      authService['generateHashPassword'] = jest
        .fn()
        .mockResolvedValue('incorrectPassword');

      await expect(authService.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
