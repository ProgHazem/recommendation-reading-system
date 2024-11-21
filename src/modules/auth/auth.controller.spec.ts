import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@App/modules/auth/auth.service';
import { RegisterDto } from '@App/modules/auth/dto/register.dto';
import { LoginDto } from '@App/modules/auth/dto/login.dto';
import { AuthController } from '@App/modules/auth/auth.controller';

describe('AuthController', () => {
  let authController: AuthController;

  // Mock data
  const registerDto: RegisterDto = {
    email: 'test@test.com',
    password: 'password123',
  };
  const loginDto: LoginDto = {
    email: 'test@test.com',
    password: 'password123',
  };

  // Mock AuthService
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return the expected result', async () => {
      const result = { message: 'User registered successfully' };
      mockAuthService.register.mockResolvedValue(result);

      const response = await authController.register(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(response).toEqual(result);
    });

    it('should handle errors from authService.register', async () => {
      const error = new Error('Registration failed');
      mockAuthService.register.mockRejectedValue(error);

      try {
        await authController.register(registerDto);
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });

  describe('login', () => {
    it('should call authService.login and return the expected result', async () => {
      const result = { token: 'fake-jwt-token' };
      mockAuthService.login.mockResolvedValue(result);

      const response = await authController.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(response).toEqual(result);
    });

    it('should handle errors from authService.login', async () => {
      const error = new Error('Login failed');
      mockAuthService.login.mockRejectedValue(error);

      try {
        await authController.login(loginDto);
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });
});
